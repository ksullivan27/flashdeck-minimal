import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  getDeck,
  updateDeck,
  deleteDeck,
  createCard,
  updateCard,
  deleteCard,
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

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!deck) return <Layout><p>Deck not found</p></Layout>;

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

      <h2 className="section-title mb-1">Cards ({deck.cards.length})</h2>

      {deck.cards.length > 0 ? (
        <div className="grid grid-4">
          {deck.cards.map((card) => (
            <div key={card.id} className="card">
              <div className="mb-1">
                <strong>Q:</strong> {card.question}
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
          <p className="empty-state-title">No cards yet</p>
          <p className="empty-state-description">
            Add your first card to start studying!
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
