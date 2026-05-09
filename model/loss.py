import torch
import torch.nn.functional as F

def contrastive_loss(image_emb, text_emb):
    logits = image_emb @ text_emb.T

    labels = torch.arange(len(logits)).to(logits.device)

    loss_i = F.cross_entropy(logits, labels)
    loss_t = F.cross_entropy(logits.T, labels)

    return (loss_i + loss_t) / 2