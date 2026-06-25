import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import yake

# Aggressive filter for common social media filler that standard NLP stopwords miss
CUSTOM_FILLER = {
    "people", "time", "thing", "things", "good", "bad", "post", "posts", "bluesky", 
    "app", "make", "know", "think", "look", "going", "really", "much", "well", 
    "even", "want", "right", "sure", "need", "never", "always"
}

def extract_advanced_keywords(texts, max_keywords=12):
    """
    Uses YAKE for initial extraction, filters out social media garbage, 
    then uses NetworkX (PageRank) to find the true central keywords.
    """
    if not texts:
        return []
        
    full_text = " ".join(texts)
    
    # 1. YAKE Extraction 
    # dedupLim=0.7 makes it strictly avoid repetitive phrases
    # top=50 gives our graph a larger pool to calculate centrality from
    kw_extractor = yake.KeywordExtractor(lan="en", n=2, dedupLim=0.7, top=50, features=None)
    raw_keywords = kw_extractor.extract_keywords(full_text)
    
    if not raw_keywords:
        return []

    # Filter out any phrase that is exactly in our custom filler list, or too short
    phrases = []
    for kw, _ in raw_keywords:
        clean_kw = kw.lower().strip()
        if clean_kw not in CUSTOM_FILLER and len(clean_kw) > 2:
            phrases.append(kw)
    
    if not phrases:
        return []

    # 2. Build Co-occurrence Graph with NetworkX
    G = nx.Graph()
    for text in texts:
        text_lower = text.lower()
        present_phrases = [p for p in phrases if p.lower() in text_lower]
        
        for i in range(len(present_phrases)):
            for j in range(i + 1, len(present_phrases)):
                w1, w2 = present_phrases[i], present_phrases[j]
                if G.has_edge(w1, w2):
                    G[w1][w2]['weight'] += 1
                else:
                    G.add_edge(w1, w2, weight=1)
    
    # Fallback if no co-occurrences were found
    if len(G.nodes) == 0:
        return phrases[:max_keywords]
        
    # 3. Calculate PageRank for true centrality
    try:
        ranks = nx.pagerank(G, weight='weight')
        ranked_keywords = sorted(ranks.items(), key=lambda x: x[1], reverse=True)
        return [kw[0] for kw in ranked_keywords[:max_keywords]]
    except Exception:
        return phrases[:max_keywords]


def select_diverse_sample_posts(posts, num_samples=5):
    """
    Uses Scikit-Learn TF-IDF and NumPy to select diverse but representative posts.
    """
    if len(posts) <= num_samples:
        return posts
        
    texts = [p['text'] for p in posts]
    
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(texts)
    except ValueError:
        return posts[:num_samples]
        
    centroid = tfidf_matrix.mean(axis=0)
    centroid_sim = cosine_similarity(tfidf_matrix, np.asarray(centroid)).flatten()
    
    doc_sim_matrix = cosine_similarity(tfidf_matrix)
    selected_indices = []
    
    first_idx = int(np.argmax(centroid_sim))
    selected_indices.append(first_idx)
    
    for _ in range(1, num_samples):
        best_score = -float('inf')
        best_idx = -1
        
        for i in range(len(posts)):
            if i in selected_indices:
                continue
                
            relevance = centroid_sim[i]
            redundancy = np.max([doc_sim_matrix[i][j] for j in selected_indices])
            
            mmr_score = 0.5 * relevance - 0.5 * redundancy
            
            if mmr_score > best_score:
                best_score = mmr_score
                best_idx = i
                
        if best_idx != -1:
            selected_indices.append(best_idx)
        else:
            break
            
    return [posts[i] for i in selected_indices]