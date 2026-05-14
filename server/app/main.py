from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pathlib import Path

# -----------------------------
# Routes
# -----------------------------
from app.routes.search import router as search_router
from app.routes.upload import router as upload_router

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include Routes
# -----------------------------
app.include_router(search_router)
app.include_router(upload_router)

# -----------------------------
# Base Paths
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent

IMAGE_DIR = BASE_DIR / "data" / "raw" / "eurosat"

# -----------------------------
# Serve Satellite Images
# -----------------------------
app.mount(
    "/images",
    StaticFiles(directory=IMAGE_DIR),
    name="images"
)

# -----------------------------
# Root Route
# -----------------------------
@app.get("/")
def root():
    return {
        "message": "WildSAT Backend Running",
        "features": [
            "Semantic Habitat Search",
            "Satellite Image Retrieval",
            "Ecological Intelligence Analysis",
            "Satellite Upload Inference"
        ]
    }