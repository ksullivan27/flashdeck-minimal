import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDecks, createDeck } from '../lib/api';

function AllDecksPage() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const response = await getDecks();
      setDecks(response.data);
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    try {
      const response = await createDeck(formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      navigate(`/decks/${response.data.id}`);
    } catch (error) {
      console.error('Error creating deck:', error);
      alert('Failed to create deck');
    }
  };

  return (
    <Layout>
      <div className="section-header">
        <h1 className="page-title">All Decks</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add New Deck
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : decks.length > 0 ? (
        <div className="grid grid-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="deck-card"
              onClick={() => navigate(`/decks/${deck.id}`)}
            >
              <h3 className="deck-name">{deck.name}</h3>
              <p className="deck-description">
                {deck.description || 'No description'}
              </p>
              <div className="deck-meta">
                <span>{deck.card_count} cards</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-title">No decks yet</p>
          <p className="empty-state-description">
            Create your first deck to get started!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Create Your First Deck
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-header">Create New Deck</h2>
            <form onSubmit={handleCreateDeck}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AllDecksPage;
