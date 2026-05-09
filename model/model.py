import torch
import torch.nn as nn
import torchvision.models as models
from transformers import DistilBertModel, DistilBertTokenizer

class CLIPModel(nn.Module):
    def __init__(self, embed_dim=256):
        super().__init__()

        # IMAGE ENCODER
        self.image_encoder = models.resnet18(weights="DEFAULT")
        self.image_encoder.fc = nn.Linear(512, embed_dim)

        # TEXT ENCODER
        self.text_encoder = DistilBertModel.from_pretrained(
            "distilbert-base-uncased"
        )
        self.tokenizer = DistilBertTokenizer.from_pretrained(
            "distilbert-base-uncased"
        )

        self.text_proj = nn.Linear(768, embed_dim)

    def encode_image(self, x):
        return self.image_encoder(x)

    def encode_text(self, text_list):
        tokens = self.tokenizer(
            text_list,
            padding=True,
            truncation=True,
            return_tensors="pt"
        )

        tokens = {k: v.to(next(self.parameters()).device) for k, v in tokens.items()}

        out = self.text_encoder(**tokens).last_hidden_state[:, 0, :]
        return self.text_proj(out)

    def forward(self, images, texts):
        img_emb = self.encode_image(images)
        txt_emb = self.encode_text(texts)

        img_emb = img_emb / img_emb.norm(dim=1, keepdim=True)
        txt_emb = txt_emb / txt_emb.norm(dim=1, keepdim=True)

        return img_emb, txt_emb