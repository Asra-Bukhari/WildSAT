import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

DB_PATH = "app/database/embeddings.pkl"

with open(DB_PATH, "rb") as f:
    database = pickle.load(f)

image_embeddings = database["embeddings"]
image_paths = database["paths"]


def convert_to_url(path):

    path = Path(path)

    class_name = path.parent.name
    file_name = path.name

    return f"http://127.0.0.1:8000/images/{class_name}/{file_name}"


def search_similar(query_embedding, top_k=5):

    sims = cosine_similarity(
        [query_embedding],
        image_embeddings
    )[0]

    top_indices = np.argsort(sims)[::-1][:top_k]

    results = []

    for idx in top_indices:

        results.append({
            "image": convert_to_url(image_paths[idx]),
            "score": float(sims[idx])
        })

    return results