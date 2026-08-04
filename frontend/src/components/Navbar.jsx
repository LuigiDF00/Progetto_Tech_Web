import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Puzzle, HelpCircle, Trophy, PlusCircle, User, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const openAuth = (tab) => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand-logo">
            <span>🧩 RegexRiddle</span>
          </Link>

          <ul className="nav-links">
            <li>
              <NavLink to="/riddles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Puzzle size={18} />
                <span>Galleria Sfide</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/rules" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HelpCircle size={18} />
                <span>Come Funziona</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Trophy size={18} />
                <span>Classifica</span>
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <PlusCircle size={18} />
                  <span>Crea Enigma</span>
                </NavLink>
              </li>
            )}
          </ul>

          <div className="user-menu">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.username}</span>
                </Link>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Disconnetti">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={() => openAuth('login')} className="btn btn-secondary btn-sm">
                  <LogIn size={16} /> Accedi
                </button>
                <button onClick={() => openAuth('register')} className="btn btn-primary btn-sm">
                  Registrati
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </>
  );
}
