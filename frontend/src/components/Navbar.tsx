import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { PixelLogoIcon, PixelUserAvatarIcon } from './PixelIcons';
import { LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const openAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="brand-logo">
            <PixelLogoIcon />
            <span>RegexRiddle</span>
          </Link>

          <ul className="nav-links">
            <li>
              <NavLink to="/riddles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span>GALLERIA SFIDE</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/rules" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span>COME FUNZIONA</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span>CLASSIFICA</span>
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span>CREA ENIGMA</span>
                </NavLink>
              </li>
            )}
          </ul>

          <div className="user-menu">
            {user ? (
              <div className="user-profile-badge">
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="avatar-pixel-frame">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="avatar-img" />
                    ) : (
                      <PixelUserAvatarIcon />
                    )}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>
                    {user.username}
                  </span>
                </Link>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Disconnetti" style={{ padding: '0.35rem 0.6rem' }}>
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={() => openAuth('login')} className="btn btn-secondary btn-sm">
                  <LogIn size={15} /> Accedi
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
