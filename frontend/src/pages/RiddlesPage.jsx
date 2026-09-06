import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Puzzle, Search, CheckCircle2, PlusCircle, Filter, Trophy } from 'lucide-react';

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

  // Ordina tutti gli enigmi per numero di risoluzioni per stabilire la classifica
  const sortedRiddles = [...riddles].sort((a, b) => b.solved_by_count - a.solved_by_count);
  // Identifica gli ID dei primi 3 enigmi più giocati
  const top3Ids = sortedRiddles.slice(0, 3).map(r => r.id);

  const filteredRiddles = sortedRiddles.filter((riddle) => {
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
          <h1 className="neon-text" style={{ fontSize: '2.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            Galleria Sfide
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Esplora gli enigmi creati dalla community e prova a risolverli.</p>
        </div>

        {user && (
          <Link to="/create" className="btn btn-neon btn-neon-pink">
            CREA NUOVO ENIGMA
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

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div className="btn btn-neon btn-neon-blue btn-sm" style={{ pointerEvents: 'none' }}>
              FILTRI
            </div>
            <button
              className={`btn btn-neon btn-sm ${filter === 'all' ? 'btn-neon-pink' : ''}`}
              style={filter !== 'all' ? { borderColor: 'rgba(236,72,153,0.3)', color: 'rgba(255,255,255,0.6)', boxShadow: 'none' } : {}}
              onClick={() => setFilter('all')}
            >
              TUTTI ({riddles.length})
            </button>
            {user && (
              <>
                <button
                  className={`btn btn-neon btn-sm ${filter === 'unsolved' ? 'btn-neon-cyan' : ''}`}
                  style={filter !== 'unsolved' ? { borderColor: 'rgba(6,182,212,0.3)', color: 'rgba(255,255,255,0.6)', boxShadow: 'none' } : {}}
                  onClick={() => setFilter('unsolved')}
                >
                  DA RISOLVERE
                </button>
                <button
                  className={`btn btn-neon btn-sm ${filter === 'solved' ? 'btn-neon-green' : ''}`}
                  style={filter !== 'solved' ? { borderColor: 'rgba(16,185,129,0.3)', color: 'rgba(255,255,255,0.6)', boxShadow: 'none' } : {}}
                  onClick={() => setFilter('solved')}
                >
                  RISOLTI
                </button>
                <button
                  className={`btn btn-neon btn-sm ${filter === 'my_riddles' ? 'btn-neon-purple' : ''}`}
                  style={filter !== 'my_riddles' ? { borderColor: 'rgba(168,85,247,0.3)', color: 'rgba(255,255,255,0.6)', boxShadow: 'none' } : {}}
                  onClick={() => setFilter('my_riddles')}
                >
                  I MIEI ENIGMI
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
          {filteredRiddles.map((riddle) => {
            const rankIndex = top3Ids.indexOf(riddle.id);
            const isGold = rankIndex === 0;
            const isSilver = rankIndex === 1;
            const isBronze = rankIndex === 2;

            let cardStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', marginTop: '1rem' };
            let rankElement = null;
            let cardClassName = "glass-card";
            let buttonClass = "btn btn-primary btn-sm";

            if (isGold) {
              cardClassName = "glass-card neon-card";
              cardStyle = { ...cardStyle, border: '3px solid #eab308', boxShadow: '0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(234, 179, 8, 0.2)', borderRadius: '12px' };
              rankElement = (
                <div className="neon-rank-badge" style={{ color: '#eab308' }}>
                  <Trophy size={16} /> ORO
                </div>
              );
              buttonClass = "btn btn-neon btn-neon-yellow btn-sm";
            } else if (isSilver) {
              cardClassName = "glass-card neon-card";
              cardStyle = { ...cardStyle, border: '3px solid #cbd5e1', boxShadow: '0 0 20px rgba(203, 213, 225, 0.4), inset 0 0 10px rgba(203, 213, 225, 0.2)', borderRadius: '12px' };
              rankElement = (
                <div className="neon-rank-badge" style={{ color: '#cbd5e1' }}>
                  <Trophy size={16} color="#cbd5e1" /> ARGENTO
                </div>
              );
              buttonClass = "btn btn-neon btn-neon-silver btn-sm";
            } else if (isBronze) {
              cardClassName = "glass-card neon-card";
              cardStyle = { ...cardStyle, border: '3px solid #d97706', boxShadow: '0 0 20px rgba(217, 119, 6, 0.4), inset 0 0 10px rgba(217, 119, 6, 0.2)', borderRadius: '12px' };
              rankElement = (
                <div className="neon-rank-badge" style={{ color: '#d97706' }}>
                  <Trophy size={16} color="#d97706" /> BRONZO
                </div>
              );
              buttonClass = "btn btn-neon btn-neon-bronze btn-sm";
            }

            return (
            <div key={riddle.id} className={cardClassName} style={cardStyle}>
              <div>
                {rankElement}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{riddle.title}</h2>
                  {riddle.is_solved_by_current_user === 1 && (
                    <span className="badge badge-emerald" title="Hai risolto questo enigma">
                      <CheckCircle2 size={12} /> Risolto
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.2rem', minHeight: '42px' }}>
                  {riddle.description.length > 110 ? `${riddle.description.substring(0, 110)}...` : riddle.description}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#34d399', marginBottom: '0.25rem' }}>
                    <strong>Esempio:</strong> <br/><code style={{ opacity: 0.8 }}>{riddle.public_pos_example}</code>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                  <span>Autore: <strong style={{ color: 'var(--primary)' }}>{riddle.author_name}</strong></span>
                  <span>Risolto da: <strong style={{ color: '#fff' }}>{riddle.solved_by_count}</strong></span>
                </div>

                <Link to={`/riddles/${riddle.id}`} className={buttonClass} style={{ width: '100%' }}>
                  {riddle.is_solved_by_current_user === 1 ? 'VISUALIZZA DETTAGLI' : 'INIZIA SFIDA'}
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
