import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AllDecksPage from './pages/AllDecksPage';
import DeckPage from './pages/DeckPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/decks" element={<AllDecksPage />} />
        <Route path="/decks/:id" element={<DeckPage />} />
        <Route path="/decks/:id/review" element={<ReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
