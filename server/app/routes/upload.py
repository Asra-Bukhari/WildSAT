from fastapi import APIRouter, UploadFile, File
from PIL import Image

import torch
import torch.nn.functional as F
import torchvision.transforms as transforms

from app.services.model_loader import model
from app.services.ecology_knowledge import ECOLOGY_INFO

router = APIRouter()

# --------------------------------------------------
# Image preprocessing
# --------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# --------------------------------------------------
# Ecosystem labels
# --------------------------------------------------
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

# --------------------------------------------------
# Upload route
# --------------------------------------------------
@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    # --------------------------------------------------
    # Validate image
    # --------------------------------------------------
    try:
        image = Image.open(file.file).convert("RGB")

    except Exception:
        return {
            "error": "Invalid image uploaded."
        }

    # --------------------------------------------------
    # Transform image
    # --------------------------------------------------
    image_tensor = transform(image).unsqueeze(0)

    device = next(model.parameters()).device

    image_tensor = image_tensor.to(device)

    # --------------------------------------------------
    # Image embedding
    # --------------------------------------------------
    with torch.no_grad():
        image_embedding = model.encode_image(image_tensor)

    image_embedding = F.normalize(image_embedding, dim=1)

    # --------------------------------------------------
    # Compare with ecosystem text embeddings
    # --------------------------------------------------
    similarities = []

    for label in CLASS_NAMES:

        texts = ECOLOGY_INFO[label]["descriptions"]

        with torch.no_grad():
            text_embedding = model.encode_text(texts)

        text_embedding = F.normalize(text_embedding, dim=1)

        scores = image_embedding @ text_embedding.T

        similarity_score = scores.mean().item()

        similarities.append((label, similarity_score))

    # --------------------------------------------------
    # Sort similarities
    # --------------------------------------------------
    similarities.sort(
        key=lambda x: x[1],
        reverse=True
    )

    # --------------------------------------------------
    # Labels + raw scores
    # --------------------------------------------------
    labels = [x[0] for x in similarities]

    raw_scores = torch.tensor(
        [x[1] for x in similarities]
    )

    # --------------------------------------------------
    # Convert to probabilities
    # --------------------------------------------------
    probabilities = F.softmax(
        raw_scores * 5,
        dim=0
    )

    best_index = torch.argmax(probabilities).item()

    best_label = labels[best_index]

    confidence = probabilities[best_index].item() * 100

    # --------------------------------------------------
    # Additional validation logic
    # --------------------------------------------------

    # Difference between top-2 predictions
    top1 = probabilities[0].item()
    top2 = probabilities[1].item()

    confidence_gap = top1 - top2

    # Reject weak/uncertain predictions
    if confidence < 45 or confidence_gap < 0.15:

        return {
            "error": (
                "This image does not appear to be "
                "a valid satellite or aerial ecosystem image."
            )
        }

    # --------------------------------------------------
    # Ecosystem information
    # --------------------------------------------------
    info = ECOLOGY_INFO[best_label]

    # --------------------------------------------------
    # Response
    # --------------------------------------------------
    return {
        "ecosystem": best_label,
        "confidence": round(confidence, 2),
        "title": info["title"],
        "climate": info["climate"],
        "biodiversity": info["biodiversity"],
        "vegetation": info["vegetation"],
        "species": info["species"],
        "risks": info["risks"],
        "analysis": info["analysis"]
    }