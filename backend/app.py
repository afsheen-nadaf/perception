import os
if os.name == 'nt':  # only on Windows
    os.environ["JAVA_HOME"] = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"

os.environ["PYSPARK_PYTHON"] = "python"
os.environ["PYSPARK_DRIVER_PYTHON"] = "python"

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify
from flask_cors import cross_origin, CORS
from dotenv import load_dotenv

import traceback

load_dotenv()

from database import db, firestore
from bluesky import fetch_bluesky_posts, init_client
from processor import preprocess_posts_with_spark
from sentiment import score_sentiment_batch, calculate_polarization

# --- NEW ML ENGINE IMPORT ---
from nlp_engine import extract_advanced_keywords, select_diverse_sample_posts


app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://perception-eosin.vercel.app"
])


_client_initialized = False

@app.before_request
def ensure_bluesky_client():
    global _client_initialized
    if not _client_initialized:
        try:
            init_client()
            _client_initialized = True
        except Exception as e:
            print(f"Failed to initialize Bluesky client: {e}")

def build_time_trend(posts):
    buckets = defaultdict(lambda: {"positive": 0, "negative": 0})
    for p in posts:
        try:
            hour = p["created_utc"][:13]  # "2026-06-21T04"
        except (TypeError, KeyError):
            continue
        sentiment = p.get("sentiment")
        if sentiment in ("positive", "negative"):
            buckets[hour][sentiment] += 1

    return [
        {"time": k.replace("T", " ") + ":00", "positive": v["positive"], "negative": v["negative"]}
        for k, v in sorted(buckets.items())
    ]


@app.route('/api/analyze', methods=['GET', 'POST', 'OPTIONS'], strict_slashes=False)
@cross_origin()
def analyze():
    if request.method == 'OPTIONS':
        return '', 200

    if request.method == 'POST':
        data = request.get_json()
        topic = data.get('topic') if data else None
    else:
        topic = request.args.get('topic')

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    six_hours_ago = datetime.now(timezone.utc) - timedelta(hours=6)
    cached_searches = db.collection("searches") \
        .where("topic", "==", topic) \
        .where("searched_at", ">=", six_hours_ago) \
        .order_by("searched_at", direction=firestore.Query.DESCENDING) \
        .limit(1).get()

    if cached_searches:
        cache_doc = cached_searches[0]
        search_id = cache_doc.id
        cache_data = cache_doc.to_dict()

        posts_ref = db.collection("searches").document(search_id).collection("posts").get()
        all_cached_posts = [p.to_dict() for p in posts_ref]
        sample_posts = all_cached_posts[:5]
        time_trend = build_time_trend(all_cached_posts)

        return jsonify({
            "searchId": search_id,
            "metrics": cache_data["metrics"],
            "polarization_score": cache_data["polarization_score"],
            "top_keywords": cache_data.get("top_keywords", {"positive": [], "negative": []}),
            "sample_posts": sample_posts,
            "time_trend": time_trend,
            "cached": True
        })

    try:
        raw_posts = fetch_bluesky_posts(topic, limit=400)
    except Exception as e:
        print("\n=== HIDDEN BLUESKY ERROR ===")
        traceback.print_exc()
        print("============================\n")
        return jsonify({"error": f"Bluesky SDK Exception: {repr(e)}"}), 500

    if not raw_posts:
        return jsonify({"error": "No data found on Bluesky for this topic"}), 404

    try:
        spark_rows = preprocess_posts_with_spark(raw_posts)
    except Exception as e:
        return jsonify({"error": f"Spark Preprocessing Error: {str(e)}"}), 500

    if not spark_rows:
        return jsonify({"error": "No data remaining after processing filters"}), 400

    texts_to_score = [row["cleaned_text"] for row in spark_rows]
    sentiment_results = score_sentiment_batch(texts_to_score)

    if not sentiment_results:
        return jsonify({"error": "HuggingFace model initializing. Try again shortly."}), 503

    pos, neg, neu = 0, 0, 0
    pos_texts, neg_texts = [], []
    processed_posts = []

    for idx, row in enumerate(spark_rows):
        res = sentiment_results[idx]
        sent = res["sentiment"]

        if sent == "positive": 
            pos += 1
            pos_texts.append(row["cleaned_text"])
        elif sent == "negative": 
            neg += 1
            neg_texts.append(row["cleaned_text"])
        else: 
            neu += 1

        processed_posts.append({
            "id": row["id"],
            "text": row["text"],
            "sentiment": sent,
            "confidence": res["confidence"],
            "created_utc": row["created_utc"]
        })

   # --- NEW ML ENGINE CALLS ---
    # Up the max_keywords to 12 for a much richer keyword cloud!
    top_pos_kw = extract_advanced_keywords(pos_texts, max_keywords=15)
    top_neg_kw = extract_advanced_keywords(neg_texts, max_keywords=15)
    keywords_dict = {"positive": top_pos_kw, "negative": top_neg_kw}

    diverse_sample_posts = select_diverse_sample_posts(processed_posts, num_samples=5)
    # ---------------------------

    total_scored = pos + neg + neu
    summary = {
        "positive": round((pos / total_scored) * 100, 1) if total_scored else 0,
        "negative": round((neg / total_scored) * 100, 1) if total_scored else 0,
        "neutral": round((neu / total_scored) * 100, 1) if total_scored else 0
    }
    pol_score = calculate_polarization(pos, neg, neu)
    time_trend = build_time_trend(processed_posts)

    # 1. Normalize the document ID to the lowercased topic name
    normalized_id = topic.strip().lower()
    search_ref = db.collection("searches").document(normalized_id)

    # 2. Save/Overwrite the top-level topic document 
    search_ref.set({
        "topic": topic,                       # Retains original casing ("Taylor Swift")
        "searched_at": datetime.now(timezone.utc),  # Fresh timestamp pushes it to the top!
        "polarization_score": pol_score,
        "metrics": summary,
        "top_keywords": keywords_dict
    })

    # 3. Clean up older sub-collection posts to avoid mixing old data with new data
    old_posts = search_ref.collection("posts").get()
    delete_batch = db.batch()
    for doc in old_posts:
        delete_batch.delete(doc.reference)
    delete_batch.commit()

    # 4. Commit the new batch of processed posts (Up to 400 fits safely under the 500 batch limit!)
    batch = db.batch()
    for p in processed_posts:
        p_doc_ref = search_ref.collection("posts").document(p["id"])
        batch.set(p_doc_ref, p)
    batch.commit()

    return jsonify({
        "searchId": search_ref.id,            # This will now be the clean name string!
        "metrics": summary,
        "polarization_score": pol_score,
        "top_keywords": keywords_dict,
        "sample_posts": diverse_sample_posts,
        "time_trend": time_trend,
        "cached": False
    })


@app.route("/api/history/<topic>", methods=["GET"])
def get_topic_history(topic):
    normalized_topic = topic.strip().lower()
    docs = db.collection("searches") \
        .where("topic", "==", normalized_topic) \
        .order_by("searched_at", direction=firestore.Query.ASCENDING).get()

    history = []
    for d in docs:
        data = d.to_dict()
        history.append({
            "searchId": d.id,
            "searched_at": data["searched_at"],
            "metrics": data["metrics"],
            "polarization_score": data["polarization_score"]
        })
    return jsonify(history)


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 5000)))