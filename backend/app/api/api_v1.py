from fastapi import APIRouter
from app.api.routes import decks

api_router = APIRouter()
api_router.include_router(decks.router, tags=["decks"])
