import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Riddle } from '../types';
import { PixelTrophyGold, PixelTrophySilver, PixelTrophyBronze } from '../components/PixelIcons';
import { Search } from 'lucide-react';

export default function RiddlesPage() {
  const { user } = useAuth();
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved' | 'my_riddles'>('all');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRiddles() {
      try {
        const data = await api.getRiddles();
        setRiddles(data.riddles || []);
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento enigmi');
      } finally {
        setLoading(false);
      }
    }
    fetchRiddles();
  }, []);

  const filteredRiddles = riddles.filter((riddle) => {
    const matchesSearch = riddle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          riddle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          riddle.author_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'solved') return Number(riddle.is_solved_by_current_user) === 1;
    if (filter === 'unsolved') return Number(riddle.is_solved_by_current_user) !== 1;
    if (filter === 'my_riddles') return user && riddle.author_id === user.id;

    return true;
  });

  const getTierInfo = (index: number) => {
    const tiers = [
      {
        name: 'ORO',
        tierClass: 'tier-gold',
        badgeClass: 'gold',
        boxClass: 'gold-bg',
        btnClass: 'card-btn-gold',
        Icon: PixelTrophyGold
      },
      {
        name: 'ARGENTO',
        tierClass: 'tier-silver',
        badgeClass: 'silver',
        boxClass: 'silver-bg',
        btnClass: 'card-btn-silver',
        Icon: PixelTrophySilver
      },
      {
        name: 'BRONZO',
        tierClass: 'tier-bronze',
        badgeClass: 'bronze',
        boxClass: 'bronze-bg',
        btnClass: 'card-btn-bronze',
        Icon: PixelTrophyBronze
      }
    ];
    return tiers[index % 3];
  };

  const getExampleLines = (riddle: Riddle) => {
    if (!riddle.public_pos_example) return ['11234', '12336', '12345', '18789'];
    const rawLines = riddle.public_pos_example.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (rawLines.length >= 3) return rawLines.slice(0, 4);
    
    const first = rawLines[0] || '1234';
    return [first, first, first, first];
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title-neon">GALLERIA SFIDE</h1>
          <p className="page-subtitle">Esplora gli enigmi creati dalla community e prova a risolverli.</p>
        </div>

        <Link to="/create" className="btn btn-pill-pink">
          CREA NUOVO ENIGMA
        </Link>
      </div>

      {/* Filter Pills Bar */}
      <div className="filter-pills-bar">
        <button
          className="pill-filter pill-filter-blue"
          onClick={() => setShowSearch(!showSearch)}
        >
          FILTRI
        </button>

        <button
          className={`pill-filter pill-filter-pink ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          TUTTI ({riddles.length})
        </button>

        <button
          className={`pill-filter pill-filter-cyan ${filter === 'unsolved' ? 'active' : ''}`}
          onClick={() => setFilter('unsolved')}
        >
          DA RISOLVERE
        </button>

        <button
          className={`pill-filter pill-filter-green ${filter === 'solved' ? 'active' : ''}`}
          onClick={() => setFilter('solved')}
        >
          RISOLTI
        </button>

        {user && (
          <button
            className={`pill-filter pill-filter-purple ${filter === 'my_riddles' ? 'active' : ''}`}
            onClick={() => setFilter('my_riddles')}
          >
            I MIEI ENIGMI
          </button>
        )}
      </div>

      {/* Optional Search Bar toggle */}
      {showSearch && (
        <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '500px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.7rem', borderRadius: '9999px', background: '#090e1a', borderColor: 'var(--neon-cyan)' }}
            placeholder="Cerca per titolo, descrizione o autore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>
          CARICAMENTO ENIGMI IN CORSO...
        </div>
      ) : filteredRiddles.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', borderRadius: '18px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Nessun enigma trovato per i filtri selezionati.
          </p>
          {user && (
            <Link to="/create" className="btn btn-pill-pink">
              CREA IL PRIMO ENIGMA
            </Link>
          )}
        </div>
      ) : (
        <div className="cards-grid">
          {filteredRiddles.map((riddle, index) => {
            const tier = getTierInfo(index);
            const TrophyIcon = tier.Icon;
            const exampleLines = getExampleLines(riddle);
            const isSolved = Number(riddle.is_solved_by_current_user) === 1;

            return (
              <div key={riddle.id} className={`riddle-card ${tier.tierClass}`}>
                {/* Top Notch Badge */}
                <div className={`card-tier-badge ${tier.badgeClass}`}>
                  <TrophyIcon />
                  <span>{tier.name}</span>
                </div>

                {/* Card Content */}
                <div>
                  <h2 className="card-title">{riddle.title}</h2>

                  {isSolved && (
                    <div className="card-status-solved">
                      RISOLTO
                    </div>
                  )}

                  <p className="card-description">
                    {riddle.description.length > 100
                      ? `${riddle.description.substring(0, 100)}...`
                      : riddle.description}
                  </p>

                  {/* Code Example Box */}
                  <div className={`card-example-box ${tier.boxClass}`}>
                    <div className="example-label">Exemplo:</div>
                    {exampleLines.map((line, lIdx) => (
                      <div key={lIdx} className="example-line">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div>
                  <div className="card-meta">
                    <span>
                      Autore: <strong className="highlight">{riddle.author_name}</strong>
                    </span>
                    <span>
                      Risolto da: <strong className="highlight">{riddle.solved_by_count ?? 0}</strong>
                    </span>
                  </div>

                  <Link to={`/riddles/${riddle.id}`} className={`card-btn ${tier.btnClass}`}>
                    {isSolved ? 'VISUALIZZA DETTAGLI' : 'INIZIA SFIDA'}
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
