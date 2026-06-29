import os
import sys
import torch

from pathlib import Path
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download

# =====================================================
# LOAD ENV
# =====================================================

load_dotenv()

# =====================================================
# IMPORT MODEL
# =====================================================

# Find the model directory in the parent tree
base_dir = None
for parent in Path(__file__).resolve().parents:
    if (parent / "model").is_dir():
        base_dir = parent
        break

if base_dir:
    sys.path.append(str(base_dir / "model"))
else:
    sys.path.append(str(Path(__file__).resolve().parents[3] / "model"))

from model import CLIPModel

# =====================================================
# DEVICE
# =====================================================

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# =====================================================
# HUGGING FACE CONFIG
# =====================================================

HF_MODEL_REPO = os.getenv("HF_MODEL_REPO")
HF_MODEL_FILE = os.getenv("HF_MODEL_FILE")

# =====================================================
# DOWNLOAD MODEL FROM HUGGING FACE
# =====================================================

MODEL_PATH = hf_hub_download(
    repo_id=HF_MODEL_REPO,
    filename=HF_MODEL_FILE
)

print(f"Model downloaded to: {MODEL_PATH}")

# =====================================================
# LOAD MODEL
# =====================================================

model = CLIPModel(embed_dim=256)

state_dict = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

model.load_state_dict(state_dict)

model.to(DEVICE)

model.eval()

print("WildSAT model loaded successfully")