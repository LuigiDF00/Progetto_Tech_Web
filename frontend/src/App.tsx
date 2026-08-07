import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import RulesPage from './pages/RulesPage';
import RiddlesPage from './pages/RiddlesPage';
import RiddleDetailPage from './pages/RiddleDetailPage';
import CreateRiddlePage from './pages/CreateRiddlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/riddles" element={<RiddlesPage />} />
            <Route path="/riddles/:id" element={<RiddleDetailPage />} />
            <Route path="/create" element={<CreateRiddlePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
