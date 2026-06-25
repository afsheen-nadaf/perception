import os
import requests

def get_hf_config():
    return {
        # Using the updated HF Router URL!
        "url": "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment",
        "headers": {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}
    }

def score_sentiment_batch(text_list):
    if not text_list:
        return []
        
    config = get_hf_config()
    results = []
    label_mapping = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}
    
    chunk_size = 20
    for i in range(0, len(text_list), chunk_size):
        chunk = text_list[i:i + chunk_size]
        chunk_results = []
        
        try:
            response = requests.post(config["url"], headers=config["headers"], json={"inputs": chunk}, timeout=15)
            response_json = response.json()
            
            if isinstance(response_json, dict) and "estimated_time" in response_json:
                return None
                
            if isinstance(response_json, list):
                if len(response_json) == 1 and isinstance(response_json[0], list) and len(response_json[0]) == len(chunk):
                    for item in response_json[0]:
                        if isinstance(item, dict) and "label" in item:
                            chunk_results.append({
                                "sentiment": label_mapping.get(item["label"], "neutral"),
                                "confidence": round(item.get("score", 0.5), 3)
                            })
                        else:
                            chunk_results.append({"sentiment": "neutral", "confidence": 0.5})
                            
                elif len(response_json) == len(chunk):
                    for item in response_json:
                        if isinstance(item, list) and len(item) > 0 and "score" in item[0]:
                            top = max(item, key=lambda x: x.get("score", 0))
                            chunk_results.append({
                                "sentiment": label_mapping.get(top.get("label"), "neutral"),
                                "confidence": round(top.get("score", 0.5), 3)
                            })
                        else:
                            chunk_results.append({"sentiment": "neutral", "confidence": 0.5})
                else:
                    print(f"=== HUGGINGFACE API WARNING: Size mismatch ===")
                    
        except Exception as e:
            print(f"=== CRITICAL HUGGINGFACE EXCEPTION: {e} ===")
            pass
            
        while len(chunk_results) < len(chunk):
            chunk_results.append({"sentiment": "neutral", "confidence": 0.5})
            
        results.extend(chunk_results[:len(chunk)])
        
    return results

def calculate_polarization(pos, neg, neu):
    total = pos + neg + neu
    if total == 0:
        return 0.0
    p_pct = pos / total
    n_pct = neg / total
    neu_pct = neu / total
    
    conflict = min(p_pct, n_pct) * 2
    dominance = max(p_pct, n_pct, neu_pct)
    return round((conflict / dominance) if dominance > 0 else 0, 2)