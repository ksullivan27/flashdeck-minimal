from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CardBase(BaseModel):
    question: str
    answer: str


class CardCreate(CardBase):
    pass


class CardUpdate(CardBase):
    pass


class StarUpdate(BaseModel):
    starred: bool


class CardResponse(CardBase):
    id: int
    deck_id: int
    starred: bool = False
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
    cards: list[CardResponse] = []

    class Config:
        from_attributes = True


class DeckSummary(DeckBase):
    id: int
    card_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
