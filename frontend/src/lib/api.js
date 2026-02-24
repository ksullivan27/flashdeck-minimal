import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Decks API
export const getDecks = () => api.get('/decks');
export const getDeck = (id) => api.get(`/decks/${id}`);
export const createDeck = (data) => api.post('/decks', data);
export const updateDeck = (id, data) => api.put(`/decks/${id}`, data);
export const deleteDeck = (id) => api.delete(`/decks/${id}`);

// Cards API
export const getCard = (id) => api.get(`/cards/${id}`);
export const createCard = (deckId, data) => api.post(`/decks/${deckId}/cards`, data);
export const updateCard = (id, data) => api.put(`/cards/${id}`, data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);

export default api;
