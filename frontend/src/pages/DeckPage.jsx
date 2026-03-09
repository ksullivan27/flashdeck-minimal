import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import {
  getDeck,
  updateDeck,
  deleteDeck,
  createCard,
  updateCard,
  deleteCard,
  setCardStarred,
} from '../lib/api';

function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditDeckModal, setShowEditDeckModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deckFormData, setDeckFormData] = useState({ name: '', description: '' });
  const [cardFormData, setCardFormData] = useState({ question: '', answer: '' });
  const [starredFilter, setStarredFilter] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    try {
      const response = await getDeck(id);
      setDeck(response.data);
      setDeckFormData({
        name: response.data.name,
        description: response.data.description || '',
      });
    } catch (error) {
      console.error('Error loading deck:', error);
      alert('Deck not found');
      navigate('/decks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeck = async (e) => {
    e.preventDefault();
    try {
      await updateDeck(id, deckFormData);
      setShowEditDeckModal(false);
      loadDeck();
    } catch (error) {
      console.error('Error updating deck:', error);
      alert('Failed to update deck');
    }
  };

  const handleDeleteDeck = async () => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      try {
        await deleteDeck(id);
        navigate('/decks');
      } catch (error) {
        console.error('Error deleting deck:', error);
        alert('Failed to delete deck');
      }
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await createCard(id, cardFormData);
      setShowAddCardModal(false);
      setCardFormData({ question: '', answer: '' });
      loadDeck();
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card');
    }
  };

  const handleEditCard = async (e) => {
    e.preventDefault();
    try {
      await updateCard(editingCard.id, cardFormData);
      setShowEditCardModal(false);
      setEditingCard(null);
      setCardFormData({ question: '', answer: '' });
      loadDeck();
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard(cardId);
        loadDeck();
      } catch (error) {
        console.error('Error deleting card:', error);
        alert('Failed to delete card');
      }
    }
  };

  const openEditCardModal = (card) => {
    setEditingCard(card);
    setCardFormData({ question: card.question, answer: card.answer });
    setShowEditCardModal(true);
  };

  const handleToggleStar = async (cardId) => {
    const card = deck.cards.find((c) => c.id === cardId);
    try {
      const response = await setCardStarred(cardId, !card.starred);
      const updatedCards = deck.cards.map((c) =>
        c.id === cardId ? { ...c, starred: response.data.starred } : c
      );
      setDeck({ ...deck, cards: updatedCards });
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!deck) return <Layout><p>Deck not found</p></Layout>;

  const starredCount = deck.cards.filter((c) => c.starred).length;
  const displayedCards = starredFilter
    ? deck.cards.filter((c) => c.starred)
    : deck.cards;

  return (
    <Layout>
      <div className="section-header">
        <h1 className="page-title">{deck.name}</h1>
        <div className="action-buttons">
          <button
            className="btn btn-primary btn-small"
            onClick={() => setShowAddCardModal(true)}
          >
            Add Card
          </button>
          <button
            className="btn btn-secondary btn-small"
            onClick={() => setShowEditDeckModal(true)}
          >
            Edit Deck
          </button>
          <button
            className="btn btn-primary btn-small"
            onClick={() => navigate(`/decks/${id}/review`)}
            disabled={deck.cards.length === 0}
          >
            Start Review
          </button>
          <button
            type="button"
            className="btn btn-star btn-small"
            onClick={() => navigate(`/decks/${id}/review?starred=true`)}
            disabled={starredCount === 0}
          >
            Review Starred ({starredCount})
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={handleDeleteDeck}
          >
            Delete Deck
          </button>
        </div>
      </div>

      {deck.description && (
        <p className="deck-description mb-2">{deck.description}</p>
      )}

      <div className="section-header">
        <h2 className="section-title">Cards ({deck.cards.length})</h2>
        <button
          type="button"
          className={`btn btn-small ${starredFilter ? 'btn-star' : 'btn-secondary'}`}
          onClick={() => setStarredFilter(!starredFilter)}
          disabled={starredCount === 0 && !starredFilter}
        >
          {starredFilter ? `Starred (${starredCount})` : `Show Starred (${starredCount})`}
        </button>
      </div>

      {displayedCards.length > 0 ? (
        <div className="grid grid-4">
          {displayedCards.map((card) => (
            <div key={card.id} className={`card${card.starred ? ' card-starred' : ''}`}>
              <div className="card-header-row">
                <div className="mb-1">
                  <strong>Q:</strong> {card.question}
                </div>
                <button
                  type="button"
                  className={`star-toggle-btn${card.starred ? ' starred' : ''}`}
                  onClick={() => handleToggleStar(card.id)}
                  aria-label={card.starred ? 'Unstar card' : 'Star card'}
                >
                  {card.starred
                    ? <StarSolid width={18} height={18} />
                    : <StarOutline width={18} height={18} />}
                </button>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => openEditCardModal(card)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-title">
            {starredFilter ? 'No starred cards' : 'No cards yet'}
          </p>
          <p className="empty-state-description">
            {starredFilter
              ? 'Star cards during review to save them for later.'
              : 'Add your first card to start studying!'}
          </p>
        </div>
      )}

      {/* Edit Deck Modal */}
      {showEditDeckModal && (
        <div className="modal-overlay" onClick={() => setShowEditDeckModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-header">Edit Deck</h2>
            <form onSubmit={handleUpdateDeck}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={deckFormData.name}
                  onChange={(e) =>
                    setDeckFormData({ ...deckFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={deckFormData.description}
                  onChange={(e) =>
                    setDeckFormData({ ...deckFormData, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditDeckModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="modal-overlay" onClick={() => setShowAddCardModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-header">Add Card</h2>
            <form onSubmit={handleAddCard}>
              <div className="form-group">
                <label className="form-label">Question</label>
                <textarea
                  className="form-textarea"
                  value={cardFormData.question}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, question: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Answer</label>
                <textarea
                  className="form-textarea"
                  value={cardFormData.answer}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, answer: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddCardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {showEditCardModal && (
        <div className="modal-overlay" onClick={() => setShowEditCardModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-header">Edit Card</h2>
            <form onSubmit={handleEditCard}>
              <div className="form-group">
                <label className="form-label">Question</label>
                <textarea
                  className="form-textarea"
                  value={cardFormData.question}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, question: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Answer</label>
                <textarea
                  className="form-textarea"
                  value={cardFormData.answer}
                  onChange={(e) =>
                    setCardFormData({ ...cardFormData, answer: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditCardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default DeckPage;
