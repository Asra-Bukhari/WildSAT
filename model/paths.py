import os

# ROOT = project root (wildsat/)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(ROOT_DIR, "data")

EUROSAT_DIR = os.path.join(DATA_DIR, "raw", "eurosat")

TEXT_PATH = os.path.join(
    DATA_DIR,
    "processed",
    "text_pairs",
    "descriptions.json"
)

CHECKPOINT_DIR = os.path.join(ROOT_DIR, "model", "checkpoints")