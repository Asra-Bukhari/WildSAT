import os
import json
import random
from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as transforms

class EuroSATDataset(Dataset):
    def __init__(self, image_dir, text_file):
        with open(text_file, "r") as f:
            self.text_data = json.load(f)

        self.label_to_texts = {
            item["label"]: item["texts"] for item in self.text_data
        }

        self.samples = []

        for label in os.listdir(image_dir):
            class_path = os.path.join(image_dir, label)
            if not os.path.isdir(class_path):
                continue

            for img in os.listdir(class_path):
                self.samples.append((os.path.join(class_path, img), label))

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]

        image = Image.open(img_path).convert("RGB")
        image = self.transform(image)

        text = random.choice(self.label_to_texts[label])

        return image, text