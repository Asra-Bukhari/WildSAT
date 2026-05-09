import torch
import os
from torch.utils.data import DataLoader

from data import EuroSATDataset
from model import CLIPModel
from loss import contrastive_loss
import configs as cfg

# 👉 IMPORT centralized paths (IMPORTANT FIX)
from paths import EUROSAT_DIR, TEXT_PATH, CHECKPOINT_DIR

# -----------------------------
# Device setup
# -----------------------------
device = torch.device(cfg.DEVICE if torch.cuda.is_available() else "cpu")

# -----------------------------
# Dataset (NO HARDCODED PATHS)
# -----------------------------
dataset = EuroSATDataset(
    image_dir=EUROSAT_DIR,
    text_file=TEXT_PATH
)

loader = DataLoader(dataset, batch_size=cfg.BATCH_SIZE, shuffle=True)

# -----------------------------
# Model + Optimizer
# -----------------------------
model = CLIPModel(cfg.EMBED_DIM).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=cfg.LR)

# Ensure checkpoint folder exists
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

# -----------------------------
# Training Loop
# -----------------------------
for epoch in range(cfg.EPOCHS):
    total_loss = 0

    for images, texts in loader:
        images = images.to(device)

        img_emb, txt_emb = model(images, list(texts))

        loss = contrastive_loss(img_emb, txt_emb)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1} | Loss: {total_loss/len(loader):.4f}")

# -----------------------------
# Save model (DEPLOYMENT SAFE)
# -----------------------------
model_path = os.path.join(CHECKPOINT_DIR, "clip_model.pth")
torch.save(model.state_dict(), model_path)

print(f"Model saved at: {model_path}")