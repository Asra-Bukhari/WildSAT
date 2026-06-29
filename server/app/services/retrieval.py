import os
import pickle
import random
import numpy as np

from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

DB_PATH = "app/database/embeddings.pkl"

with open(DB_PATH, "rb") as f:
    database = pickle.load(f)

image_embeddings = database["embeddings"]
image_paths = database["paths"]


# =====================================================
# RANDOM COORDINATES BY ECOSYSTEM
# =====================================================

ECOSYSTEM_COORDS = {

    "Forest": [
        [46.8, -121.7],
        [59.1, 10.7],
        [-3.4, -62.2]
    ],

    "SeaLake": [
        [64.2, -22.0],
        [43.2, -79.3],
        [-33.9, 18.4]
    ],

    "River": [
        [30.0, 31.2],
        [-3.1, -60.0],
        [48.8, 2.3]
    ],

    "Industrial": [
        [40.7, -74.0],
        [51.5, -0.1],
        [35.6, 139.6]
    ],

    "Residential": [
        [34.0, -118.2],
        [41.9, 12.5],
        [24.8, 67.0]
    ],

    "AnnualCrop": [
        [28.6, 77.2],
        [45.5, 9.2],
        [35.1, -90.0]
    ],

    "Pasture": [
        [-25.7, 28.2],
        [54.5, -2.5],
        [39.1, -84.5]
    ],

    "PermanentCrop": [
        [41.9, 12.4],
        [37.3, -5.9],
        [-34.6, -58.4]
    ],

    "HerbaceousVegetation": [
        [48.5, -100.4],
        [-33.4, 20.5],
        [55.7, 37.6]
    ],

    "Highway": [
        [29.7, -95.3],
        [52.5, 13.4],
        [31.5, 74.3]
    ]
}


# =====================================================
# IMAGE URL
# =====================================================

def convert_to_url(path):

    path = Path(path)

    class_name = path.parent.name
    file_name = path.name

    base_url = os.getenv("API_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
    return f"{base_url}/images/{class_name}/{file_name}"


# =====================================================
# SEARCH
# =====================================================

def search_similar(query_embedding, top_k=5):

    sims = cosine_similarity(
        [query_embedding],
        image_embeddings
    )[0]

    top_indices = np.argsort(sims)[::-1][:top_k]

    results = []

    for idx in top_indices:

        image_path = image_paths[idx]

        ecosystem = Path(image_path).parent.name

        coords = random.choice(
            ECOSYSTEM_COORDS.get(
                ecosystem,
                [[0, 0]]
            )
        )

        results.append({
            "image": convert_to_url(image_path),
            "score": float(sims[idx]),
            "coordinates": coords,
            "ecosystem": ecosystem
        })

    return results