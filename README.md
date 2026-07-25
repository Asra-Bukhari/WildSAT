# WildSAT: Ecological Intelligence Dashboard

WildSAT is an AI-powered ecological intelligence system that performs semantic retrieval and ecosystem analysis from satellite imagery using multimodal deep learning.

The project combines:

* Satellite image understanding
* Natural language ecological search
* Semantic image retrieval
* Interactive geospatial visualization
* Ecosystem & biodiversity analysis
* Vision Transformers + CNN hybrid modeling

Users can search ecological concepts such as:

```text
temperate forest
humid tropical ecosystem
wildfire prone vegetation
arctic habitat
dense biodiversity region
```

and retrieve semantically relevant satellite imagery in real time.

---

# Features

## Semantic Ecological Search

Search using natural language instead of fixed labels.

Examples:

```text
dense forest with wildlife
cold aquatic ecosystem
dry agricultural land
urban industrial region
```

The system retrieves the most semantically similar satellite regions.

---

## Hybrid AI Architecture

WildSAT combines:

* ResNet18 (CNN)
* Vision Transformer (ViT-B/16)
* DistilBERT

to jointly learn image-text ecological embeddings.

---

## Interactive Geospatial Visualization

Results are visualized on an interactive Mapbox satellite map with:

* animated markers
* ecosystem cards
* biodiversity insights
* environmental risk analysis

---

## Ecosystem Intelligence

Each ecosystem includes:

* climate profile
* biodiversity level
* vegetation density
* ecological risks
* likely wildlife species
* environmental analysis

---

## Image Upload Analysis

Users can upload raw satellite imagery and receive:

* predicted ecosystem type
* biodiversity analysis
* environmental health description
* likely species habitat information
* ecological risk assessment

---

# Project Architecture

```text
WildSAT
│
├── client/                 # React frontend
│
├── server/                 # FastAPI backend
│
├── data/                    
│   ├── raw/
│   ├── processed/
│
├── model/
│
└── README.md
```

---

# Tech Stack

## Frontend

* React
* Vite
* Mapbox GL
* Axios
* CSS3

---

## Backend

* FastAPI
* PyTorch
* Transformers
* Torchvision
* NumPy
* PIL

---

## AI / ML

* ResNet18
* Vision Transformer (ViT-B/16)
* DistilBERT
* Contrastive Learning
* CLIP-style multimodal retrieval

---

# Dataset

## EuroSAT Dataset

Dataset used:

EuroSAT

Contains:

* 27,000+ satellite images
* 10 ecological land-cover classes

Classes:

* Forest
* River
* SeaLake
* Residential
* Highway
* Industrial
* Pasture
* PermanentCrop
* AnnualCrop
* HerbaceousVegetation

---

# AI Model Architecture

## Hybrid Image Encoder

WildSAT uses a hybrid image encoder combining:

### ResNet18

Used for:

* local texture extraction
* vegetation detail detection
* structural pattern learning

### Vision Transformer (ViT-B/16)

Used for:

* global spatial understanding
* large-scale ecological context
* attention-based feature learning

Both embeddings are fused together into a shared ecological representation space.

---

## Text Encoder

### DistilBERT

Used to encode:

* ecological descriptions
* habitat queries
* biodiversity semantics
* environmental language

Example:

```text
humid biodiversity-rich ecosystem with dense canopy vegetation
```

---

# Multimodal Learning

WildSAT follows a CLIP-style training approach.

The system learns to align:

```text
satellite images ↔ ecological text descriptions
```

inside a shared embedding space.

This enables:

* zero-shot retrieval
* semantic habitat search
* ecological similarity reasoning

---

# Training Pipeline

## 1. Image Encoding

Satellite images are passed through:

* ResNet18
* ViT-B/16

---

## 2. Text Encoding

Ecological descriptions are encoded using DistilBERT.

---

## 3. Contrastive Learning

The model minimizes distance between:

* matching image-text pairs

and maximizes distance between:

* unrelated image-text pairs

---

## 4. Embedding Generation

Embeddings are generated and stored for fast retrieval.

---

# Semantic Retrieval Pipeline

```text
User Query
     ↓
DistilBERT Text Embedding
     ↓
Cosine Similarity Search
     ↓
Top Matching Satellite Embeddings
     ↓
Interactive Ecological Visualization
```

---

# Image Upload Analysis Pipeline

```text
Uploaded Satellite Image
        ↓
Hybrid Image Encoder
        ↓
Similarity Against Ecological Classes
        ↓
Environmental Intelligence Output
```

Output includes:

* ecosystem type
* climate
* biodiversity
* wildlife habitat prediction
* ecological risks
* environmental analysis

---

# Ecological Intelligence Layer

WildSAT extends traditional land-cover classification by introducing:

* climate semantics
* biodiversity understanding
* habitat intelligence
* ecological risk reasoning

Example analysis:

```text
This region resembles fragmented temperate forest ecosystems
commonly associated with grey wolves, deer populations,
and moderate wildfire susceptibility.
```

---

# Frontend Features

## Interactive Map

Built using:

* Mapbox Satellite Streets

Includes:

* animated markers
* ecosystem popups
* ecological metadata
* confidence visualization

---

## Search Interface

Users can search:

```text
tropical rainforest
arctic water ecosystem
dense vegetation habitat
```

without predefined labels.

---

## Upload Interface

Users can upload satellite images directly for ecological analysis.

---

# API Endpoints

## Search Endpoint

```http
GET /search?query=forest
```

Returns:

* top matching satellite images
* similarity scores

---

## Upload Analysis Endpoint

```http
POST /analyze-image
```

Accepts:

* satellite image upload

Returns:

* ecosystem analysis
* biodiversity insights
* species predictions
* environmental risks

---

# Installation

## Clone Repository

```bash
git clone <your-repo-url>
cd WildSAT
```

---

# Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

Activate:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Backend

```bash
cd server
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Environment Variables

Create:

```text
client/.env
```

Add:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token
```

Get Mapbox token from:

[Mapbox](https://www.mapbox.com/?utm_source=chatgpt.com)

---

# Training the Model

## Run Training

```bash
python train.py
```

---

## Generate Embeddings

```bash
python generate_embeddings.py
```

---

# Research Inspiration

WildSAT was inspired by recent multimodal ecological intelligence systems and geospatial AI research.

The project adapts concepts from:

* CLIP-style multimodal learning
* ecological semantic retrieval
* satellite representation learning
* biodiversity-aware AI systems

---

# Comparison with Original WildSAT Paper

| Component              | Original Paper                   | WildSAT Project               |
| ---------------------- | -------------------------------- | ----------------------------- |
| Satellite Encoder      | ResNet50 / ViT-L                 | ResNet18 + ViT-B/16           |
| Text Encoder           | GritLM                           | DistilBERT                    |
| Location Encoder       | SINR                             | Simulated geospatial metadata |
| Dataset Scale          | Millions of observations         | EuroSAT                       |
| Retrieval              | Large-scale ecological retrieval | Semantic ecosystem retrieval  |
| Fine-Tuning            | PEFT / DoRA                      | Full multimodal fine-tuning   |
| Biodiversity Reasoning | Species-level                    | Ecosystem-level               |

---

# Why Different Architectures Were Used

The original WildSAT research used extremely large-scale infrastructure requiring:

* massive biodiversity datasets
* geospatial species observations
* large GPU clusters

For an academic semester-scale implementation, WildSAT uses:

* lightweight transformer models
* smaller ecological datasets
* efficient hybrid architectures

while preserving the core research ideas:

* multimodal ecological intelligence
* semantic retrieval
* biodiversity-aware reasoning

---

# Future Improvements

## Planned Extensions

* FAISS vector retrieval
* Real geospatial coordinates
* Temporal satellite analysis
* Climate forecasting
* Species distribution modeling
* Multi-spectral satellite imagery
* Remote sensing foundation models
* Real biodiversity databases

---

# Resume / Research Keywords

This project demonstrates experience with:

* Deep Learning
* Computer Vision
* Vision Transformers
* Multimodal AI
* CLIP Architectures
* Semantic Search
* Ecological AI
* Satellite Imagery Analysis
* Remote Sensing
* FastAPI
* React
* Mapbox
* PyTorch
* HuggingFace Transformers

---

# Authors

Developed as an ecological intelligence and multimodal AI research project.

---

# License

MIT License
