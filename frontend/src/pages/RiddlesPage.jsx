import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Puzzle, Search, CheckCircle2, PlusCircle, Filter } from 'lucide-react';

export default function RiddlesPage() {
  const { user } = useAuth();
  const [riddles, setRiddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, solved, unsolved, my_riddles

  useEffect(() => {
    async function fetchRiddles() {
      try {
        const data = await api.getRiddles();
        setRiddles(data.riddles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRiddles();
  }, []);

  const filteredRiddles = riddles.filter((riddle) => {
    // Filtro per ricerca testuale
    const matchesSearch = riddle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          riddle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          riddle.author_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filtro per categoria
    if (filter === 'solved') return riddle.is_solved_by_current_user === 1;
    if (filter === 'unsolved') return riddle.is_solved_by_current_user !== 1;
    if (filter === 'my_riddles') return user && riddle.author_id === user.id;

    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Puzzle size={32} style={{ color: 'var(--primary)' }} /> Galleria Sfide
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Esplora gli enigmi creati dalla community e prova a risolverli.</p>
        </div>

        {user && (
          <Link to="/create" className="btn btn-primary">
            <PlusCircle size={18} /> Crea Nuovo Enigma
          </Link>
        )}
      </div>

      {/* Controlli Filtro e Ricerca */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.7rem' }}
              placeholder="Cerca per titolo, descrizione o autore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.3rem' }} />
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              Tutti ({riddles.length})
            </button>
            {user && (
              <>
                <button
                  className={`btn btn-sm ${filter === 'unsolved' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('unsolved')}
                >
                  Da Risolvere
                </button>
                <button
                  className={`btn btn-sm ${filter === 'solved' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('solved')}
                >
                  Risolti
                </button>
                <button
                  className={`btn btn-sm ${filter === 'my_riddles' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('my_riddles')}
                >
                  I Miei Enigmi
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Caricamento enigmi in corso...
        </div>
      ) : filteredRiddles.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Nessun enigma trovato per i filtri selezionati.
          </p>
          {user && (
            <Link to="/create" className="btn btn-primary btn-sm">
              Crea il primo enigma
            </Link>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {filteredRiddles.map((riddle) => (
            <div key={riddle.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{riddle.title}</h2>
                  {riddle.is_solved_by_current_user === 1 && (
                    <span className="badge badge-emerald" title="Hai risolto questo enigma">
                      <CheckCircle2 size={12} /> Risolto
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.2rem', minHeight: '42px' }}>
                  {riddle.description.length > 110 ? `${riddle.description.substring(0, 110)}...` : riddle.description}
                </p>

                <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                  <div style={{ color: '#34d399', marginBottom: '0.25rem' }}>
                    <strong>Esempio (+):</strong> <code>{riddle.public_pos_example}</code>
                  </div>
                  <div style={{ color: '#fb7185' }}>
                    <strong>Esempio (-):</strong> <code>{riddle.public_neg_example}</code>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                  <span>Autore: <strong>{riddle.author_name}</strong></span>
                  <span>Risolto da: <strong>{riddle.solved_by_count}</strong></span>
                </div>

                <Link to={`/riddles/${riddle.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  {riddle.is_solved_by_current_user === 1 ? 'Visualizza Dettagli' : 'Gioca e Risolvi'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
