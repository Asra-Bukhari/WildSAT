from fastapi import APIRouter

from app.services.embedding import get_text_embedding
from app.services.retrieval import search_similar

router = APIRouter()

@router.get("/search")
def search(query: str):

    query_emb = get_text_embedding(query)

    results = search_similar(query_emb)

    return {
        "query": query,
        "results": results
    }