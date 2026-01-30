from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import Deck, Card
from app.schemas import (
    DeckCreate,
    DeckUpdate,
    DeckResponse,
    DeckSummary,
    CardCreate,
    CardUpdate,
    CardResponse,
)

router = APIRouter()


@router.post("/decks", response_model=DeckResponse, status_code=201)
def create_deck(deck: DeckCreate, db: Session = Depends(get_db)):
    """Create a new deck"""
    db_deck = Deck(**deck.model_dump())
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    return db_deck


@router.get("/decks", response_model=List[DeckSummary])
def list_decks(db: Session = Depends(get_db)):
    """Get all decks with card counts"""
    decks = db.query(Deck).all()
    result = []
    for deck in decks:
        deck_dict = {
            "id": deck.id,
            "name": deck.name,
            "description": deck.description,
            "card_count": len(deck.cards),
            "created_at": deck.created_at,
            "updated_at": deck.updated_at,
        }
        result.append(deck_dict)
    return result


@router.get("/decks/{deck_id}", response_model=DeckResponse)
def get_deck(deck_id: int, db: Session = Depends(get_db)):
    """Get a specific deck with all its cards"""
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck


@router.put("/decks/{deck_id}", response_model=DeckResponse)
def update_deck(deck_id: int, deck_update: DeckUpdate, db: Session = Depends(get_db)):
    """Update a deck"""
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not db_deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    for key, value in deck_update.model_dump().items():
        setattr(db_deck, key, value)

    db.commit()
    db.refresh(db_deck)
    return db_deck


@router.delete("/decks/{deck_id}", status_code=204)
def delete_deck(deck_id: int, db: Session = Depends(get_db)):
    """Delete a deck"""
    db_deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not db_deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    db.delete(db_deck)
    db.commit()
    return None


# Card endpoints
@router.post("/decks/{deck_id}/cards", response_model=CardResponse, status_code=201)
def create_card(deck_id: int, card: CardCreate, db: Session = Depends(get_db)):
    """Create a new card in a deck"""
    # Check if deck exists
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    db_card = Card(**card.model_dump(), deck_id=deck_id)
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


@router.get("/cards/{card_id}", response_model=CardResponse)
def get_card(card_id: int, db: Session = Depends(get_db)):
    """Get a specific card"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.put("/cards/{card_id}", response_model=CardResponse)
def update_card(card_id: int, card_update: CardUpdate, db: Session = Depends(get_db)):
    """Update a card"""
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")

    for key, value in card_update.model_dump().items():
        setattr(db_card, key, value)

    db.commit()
    db.refresh(db_card)
    return db_card


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    """Delete a card"""
    db_card = db.query(Card).filter(Card.id == card_id).first()
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")

    db.delete(db_card)
    db.commit()
    return None
