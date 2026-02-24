import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDeck } from '../lib/api';

function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    try {
      const response = await getDeck(id);
      if (response.data.cards.length === 0) {
        alert('This deck has no cards to review');
        navigate(`/decks/${id}`);
        return;
      }
      setDeck(response.data);
    } catch (error) {
      console.error('Error loading deck:', error);
      alert('Failed to load deck');
      navigate('/decks');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      if (window.confirm('You have reviewed all cards! Return to deck?')) {
        navigate(`/decks/${id}`);
      }
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!deck || deck.cards.length === 0) return <Layout><p>No cards to review</p></Layout>;

  const currentCard = deck.cards[currentCardIndex];

  return (
    <Layout>
      <div className="text-center mb-2">
        <h1 className="page-title">{deck.name}</h1>
        <p className="text-secondary">
          Card {currentCardIndex + 1} of {deck.cards.length}
        </p>
      </div>

      <div className="flashcard-container">
        <div
          key={`${currentCardIndex}-${isFlipped}`}
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flashcard-face flashcard-front">
            <div className="flashcard-text">{currentCard.question}</div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-text">{currentCard.answer}</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <p className="text-secondary mb-1">
          {isFlipped ? 'Click card to show question' : 'Click card to reveal answer'}
        </p>
        <button
          className="btn btn-primary btn-large"
          onClick={handleNext}
        >
          {currentCardIndex < deck.cards.length - 1 ? 'Next Card' : 'Finish Review'}
        </button>
      </div>
    </Layout>
  );
}

export default ReviewPage;
