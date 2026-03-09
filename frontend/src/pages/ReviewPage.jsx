import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const cardIndexRef = useRef(0);

  useEffect(() => {
    let active = true;
    cardIndexRef.current = 0;
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setLoading(true);

    (async () => {
      try {
        const response = await getDeck(id);
        if (!active) return;
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
        if (!active) return;
        console.error('Error loading deck:', error);
        alert('Failed to load deck');
        navigate('/decks');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [id, starredOnly, navigate]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handlePrevious = useCallback(() => {
    if (cardIndexRef.current > 0) {
      cardIndexRef.current -= 1;
      setCurrentCardIndex(cardIndexRef.current);
      setIsFlipped(false);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!deck) return;
    if (cardIndexRef.current < deck.cards.length - 1) {
      cardIndexRef.current += 1;
      setCurrentCardIndex(cardIndexRef.current);
      setIsFlipped(false);
    } else {
      if (window.confirm('You have reviewed all cards! Return to deck?')) {
        navigate(`/decks/${id}`);
      }
    }
  }, [deck, navigate, id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return;
      if (showDeleteConfirm) return;
      if (!deck || deck.cards.length === 0) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case 'ArrowRight':
        case 'n':
        case 'N':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'p':
        case 'P':
          e.preventDefault();
          handlePrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, showDeleteConfirm, handleNext, handlePrevious]);

  const handleToggleStar = async (e) => {
    e.stopPropagation();
    const cardId = currentCard.id;
    const newStarred = !currentCard.starred;
    const wasStarredOnly = starredOnly;
    try {
      const response = await setCardStarred(cardId, newStarred);
      if (wasStarredOnly && !response.data.starred) {
        const updatedCards = deck.cards.filter((c) => c.id !== cardId);
        if (updatedCards.length === 0) {
          navigate(`/decks/${id}`);
          return;
        }
        setDeck((prev) => ({ ...prev, cards: updatedCards }));
        if (cardIndexRef.current >= updatedCards.length) {
          cardIndexRef.current = updatedCards.length - 1;
        }
        setCurrentCardIndex(cardIndexRef.current);
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
      setDeck((prev) => ({ ...prev, cards: updatedCards }));
      if (cardIndexRef.current >= updatedCards.length) {
        cardIndexRef.current = updatedCards.length - 1;
      }
      setCurrentCardIndex(cardIndexRef.current);
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
          {' · '}
          <span className="keyboard-hint">Space to flip · ← → or N/P to navigate</span>
        </p>
        <div className="review-nav-buttons">
          <button
            className="btn btn-secondary btn-large"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
          >
            Previous Card
          </button>
          <button
            className="btn btn-primary btn-large"
            onClick={handleNext}
          >
            {currentCardIndex < deck.cards.length - 1 ? 'Next Card' : 'Finish Review'}
          </button>
        </div>
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
