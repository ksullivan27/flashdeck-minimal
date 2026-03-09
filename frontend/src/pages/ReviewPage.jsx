import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TrashIcon, StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import { getDeck, deleteCard, setCardStarred } from '../lib/api';

function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const starredOnly = searchParams.get('starred') === 'true';
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    loadDeck();
  }, [id, starredOnly]);

  const loadDeck = async () => {
    try {
      const response = await getDeck(id);
      const cards = starredOnly
        ? response.data.cards.filter((c) => c.starred)
        : response.data.cards;
      if (cards.length === 0) {
        alert(starredOnly ? 'No starred cards to review' : 'This deck has no cards to review');
        navigate(`/decks/${id}`);
        return;
      }
      setDeck({ ...response.data, cards });
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

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    const cardId = currentCard.id;
    const newStarred = !currentCard.starred;
    const wasStarredOnly = starredOnly;
    try {
      const response = await setCardStarred(cardId, newStarred);
      if (wasStarredOnly && !response.data.starred) {
        setDeck((prev) => {
          const updatedCards = prev.cards.filter((c) => c.id !== cardId);
          if (updatedCards.length === 0) {
            navigate(`/decks/${id}`);
            return prev;
          }
          return { ...prev, cards: updatedCards };
        });
        setCurrentCardIndex((prev) => {
          const remaining = deck.cards.filter((c) => c.id !== cardId).length;
          return prev >= remaining ? remaining - 1 : prev;
        });
        setIsFlipped(false);
      } else {
        setDeck((prev) => ({
          ...prev,
          cards: prev.cards.map((c) =>
            c.id === cardId ? { ...c, starred: response.data.starred } : c
          ),
        }));
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      alert('Failed to update star');
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setPendingDeleteId(currentCard.id);
    setPendingDeleteIndex(currentCardIndex);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteCard(pendingDeleteId);
      const updatedCards = deck.cards.filter((_, i) => i !== pendingDeleteIndex);
      if (updatedCards.length === 0) {
        navigate(`/decks/${id}`);
        return;
      }
      setDeck({ ...deck, cards: updatedCards });
      if (currentCardIndex >= updatedCards.length) {
        setCurrentCardIndex(updatedCards.length - 1);
      }
      setIsFlipped(false);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setPendingDeleteId(null);
      setPendingDeleteIndex(null);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!deck || deck.cards.length === 0) return <Layout><p>No cards to review</p></Layout>;

  const currentCard = deck.cards[currentCardIndex];

  return (
    <Layout>
      <div className="text-center mb-2">
        <h1 className="page-title">{deck.name}</h1>
        {starredOnly && <p className="starred-badge">Reviewing Starred Cards</p>}
        <p className="text-secondary">
          Card {currentCardIndex + 1} of {deck.cards.length}
        </p>
      </div>

      <div className="flashcard-container">
        <div
          key={currentCardIndex}
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flashcard-face flashcard-front">
            <button
              type="button"
              className={`flashcard-star-btn${currentCard.starred ? ' starred' : ''}`}
              onClick={handleToggleStar}
              aria-label={currentCard.starred ? 'Unstar card' : 'Star card'}
            >
              {currentCard.starred
                ? <StarSolid width={20} height={20} />
                : <StarOutline width={20} height={20} />}
            </button>
            <button
              type="button"
              className="flashcard-delete-btn"
              onClick={handleDeleteClick}
              aria-label="Delete card"
            >
              <TrashIcon width={18} height={18} />
            </button>
            <div className="flashcard-text">{currentCard.question}</div>
          </div>
          <div className="flashcard-face flashcard-back">
            <button
              type="button"
              className={`flashcard-star-btn${currentCard.starred ? ' starred' : ''}`}
              onClick={handleToggleStar}
              aria-label={currentCard.starred ? 'Unstar card' : 'Star card'}
            >
              {currentCard.starred
                ? <StarSolid width={20} height={20} />
                : <StarOutline width={20} height={20} />}
            </button>
            <button
              type="button"
              className="flashcard-delete-btn"
              onClick={handleDeleteClick}
              aria-label="Delete card"
            >
              <TrashIcon width={18} height={18} />
            </button>
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

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-card-title"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowDeleteConfirm(false);
                setPendingDeleteId(null);
                setPendingDeleteIndex(null);
              }
            }}
          >
            <div id="delete-card-title" className="modal-header">Delete Card</div>
            <p>Are you sure you want to delete this card? This action cannot be undone.</p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPendingDeleteId(null);
                  setPendingDeleteIndex(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ReviewPage;
