import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getDecks } from '../lib/api';

function DashboardPage() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ deckCount: 0, cardCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const response = await getDecks();
      const allDecks = response.data;
      setDecks(allDecks.slice(0, 4));

      const totalCards = allDecks.reduce((sum, deck) => sum + deck.card_count, 0);
      setStats({
        deckCount: allDecks.length,
        cardCount: totalCards,
      });
    } catch (error) {
      console.error('Error loading decks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate static heatmap data
  const generateHeatmap = () => {
    const cells = [];
    for (let i = 0; i < 52; i++) {
      const random = Math.random();
      let className = 'heatmap-cell';
      if (random > 0.7) className += ' high';
      else if (random > 0.4) className += ' medium';
      else if (random > 0.2) className += ' low';
      cells.push(<div key={i} className={className}></div>);
    }
    return cells;
  };

  return (
    <Layout>
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Decks</div>
          <div className="stat-value">{stats.deckCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Cards</div>
          <div className="stat-value">{stats.cardCount}</div>
        </div>
        <div className="stat-card heatmap-container">
          <div className="stat-label mb-1">Activity</div>
          <div className="heatmap-grid">{generateHeatmap()}</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Quick Start</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/decks')}
        >
          Create New Deck
        </button>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Your Decks</h2>
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
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DashboardPage;
