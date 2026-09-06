import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    emailOrUsername: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login, register } = useAuth();

  useEffect(() => {
    setTab(initialTab);
    setError('');
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      emailOrUsername: ''
    });
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(formData.emailOrUsername, formData.password);
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Chiudi">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
              color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => { setTab('login'); setError(''); }}
          >
            <LogIn size={16} style={{ display: 'inline', marginRight: '6px' }} /> Accedi
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
              color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => { setTab('register'); setError(''); }}
          >
            <UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Registrati
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 'login' ? (
            <>
              <div className="form-group">
                <label className="form-label">Username o Email</label>
                <input
                  type="text"
                  name="emailOrUsername"
                  className="form-control"
                  placeholder="Inserisci username o email"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Scelta username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder="Nome"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cognome</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    placeholder="Cognome"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="tua@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Elaborazione in corso...' : tab === 'login' ? 'Accedi' : 'Crea Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
