import torch
from PIL import Image
import torchvision.transforms as transforms

from .model_loader import model, DEVICE

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def get_image_embedding(image_path):

    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        emb = model.encode_image(image)

    emb = emb / emb.norm(dim=1, keepdim=True)

    return emb.cpu().numpy()[0]


def get_text_embedding(text):

    with torch.no_grad():
        emb = model.encode_text([text])

    emb = emb / emb.norm(dim=1, keepdim=True)

    return emb.cpu().numpy()[0]