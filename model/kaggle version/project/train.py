import torch
import os
from torch.utils.data import DataLoader

from data import EuroSATDataset
from model import CLIPModel
from loss import contrastive_loss
import configs as cfg

# -----------------------------
# Device setup
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", device)

# -----------------------------
# Dataset
# -----------------------------
dataset = EuroSATDataset(
    image_dir="/kaggle/input/datasets/asra0703/eurosat/eurosat",
    text_file="/kaggle/input/datasets/asra0703/project/project/descriptions.json"
)

loader = DataLoader(
    dataset,
    batch_size=cfg.BATCH_SIZE,
    shuffle=True
)

# -----------------------------
# Model + Optimizer
# -----------------------------
model = CLIPModel(cfg.EMBED_DIM).to(device)

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=cfg.LR
)

# -----------------------------
# Create checkpoints folder
# -----------------------------
os.makedirs("checkpoints", exist_ok=True)

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

    avg_loss = total_loss / len(loader)

    print(f"Epoch {epoch+1} | Loss: {avg_loss:.4f}")

    # SAVE EVERY EPOCH
    checkpoint_path = f"checkpoints/clip_epoch_{epoch+1}.pth"

    torch.save(model.state_dict(), checkpoint_path)

# -----------------------------
# Final Save
# -----------------------------
torch.save(model.state_dict(), "clip_model.pth")

print("Training Complete!")