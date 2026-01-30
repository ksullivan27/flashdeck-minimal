from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CardBase(BaseModel):
    question: str
    answer: str


class CardCreate(CardBase):
    pass


class CardUpdate(CardBase):
    pass


class CardResponse(CardBase):
    id: int
    deck_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None


class DeckCreate(DeckBase):
    pass


class DeckUpdate(DeckBase):
    pass


class DeckResponse(DeckBase):
    id: int
    created_at: datetime
    updated_at: datetime
    cards: List[CardResponse] = []

    class Config:
        from_attributes = True


class DeckSummary(DeckBase):
    id: int
    card_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
