import os
import pickle
from pathlib import Path

from app.services.embedding import get_image_embedding

EUROSAT_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "raw"
    / "eurosat"
)

embeddings = []
paths = []

for label in os.listdir(EUROSAT_PATH):

    label_path = EUROSAT_PATH / label

    if not label_path.is_dir():
        continue

    for img_name in os.listdir(label_path):

        img_path = label_path / img_name

        try:
            emb = get_image_embedding(img_path)

            embeddings.append(emb)
            paths.append(str(img_path))

            print("Processed:", img_name)

        except Exception as e:
            print("Error:", e)

database = {
    "embeddings": embeddings,
    "paths": paths
}

os.makedirs("app/database", exist_ok=True)

with open("app/database/embeddings.pkl", "wb") as f:
    pickle.dump(database, f)

print("Embeddings database created!")