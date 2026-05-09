from fastapi import APIRouter, UploadFile, File
from PIL import Image
import torch
import torchvision.transforms as transforms
import os

from app.services.model_loader import model
from app.services.ecology_knowledge import ECOLOGY_INFO

router = APIRouter()

# -----------------------------
# Image preprocessing
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# -----------------------------
# Ecosystem labels
# IMPORTANT:
# Must match training folders
# -----------------------------
CLASS_NAMES = [
    "AnnualCrop",
    "Forest",
    "HerbaceousVegetation",
    "Highway",
    "Industrial",
    "Pasture",
    "PermanentCrop",
    "Residential",
    "River",
    "SeaLake"
]

# -----------------------------
# Upload route
# -----------------------------
@router.post("/upload")

async def upload_image(file: UploadFile = File(...)):

    image = Image.open(file.file).convert("RGB")
    image_tensor = transform(image).unsqueeze(0)

    device = next(model.parameters()).device
    image_tensor = image_tensor.to(device)

    # -----------------------------
    # Encode image
    # -----------------------------
    with torch.no_grad():
        image_embedding = model.encode_image(image_tensor)

    # -----------------------------
    # Compare against class texts
    # -----------------------------
    similarities = []

    for label in CLASS_NAMES:

        texts = ECOLOGY_INFO[label]["descriptions"]

        with torch.no_grad():
            text_embedding = model.encode_text(texts)

        image_embedding_norm = image_embedding / image_embedding.norm(dim=1, keepdim=True)
        text_embedding_norm = text_embedding / text_embedding.norm(dim=1, keepdim=True)

        scores = image_embedding_norm @ text_embedding_norm.T

        score = scores.mean().item()

        similarities.append((label, score))

    similarities.sort(key=lambda x: x[1], reverse=True)

    best_label, best_score = similarities[0]

    info = ECOLOGY_INFO[best_label]

    return {
        "ecosystem": best_label,
        "confidence": round(best_score * 100, 2),
        "title": info["title"],
        "climate": info["climate"],
        "biodiversity": info["biodiversity"],
        "vegetation": info["vegetation"],
        "species": info["species"],
        "risks": info["risks"],
        "analysis": info["analysis"]
    }