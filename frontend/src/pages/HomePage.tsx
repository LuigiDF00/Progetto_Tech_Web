import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Riddle } from '../types';
import { PixelTrophyGold, PixelTrophySilver, PixelTrophyBronze } from '../components/PixelIcons';
import { Terminal, Shield, Trophy, ArrowRight, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ riddlesCount: 0, totalSolved: 0 });
  const [featuredRiddles, setFeaturedRiddles] = useState<Riddle[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getRiddles();
        if (data.riddles) {
          setFeaturedRiddles(data.riddles.slice(0, 3));
          setStats({
            riddlesCount: data.riddles.length,
            totalSolved: data.riddles.reduce((acc, r) => acc + (r.solved_by_count || 0), 0)
          });
        }
      } catch (err) {
        console.error('Errore nel caricamento dati homepage:', err);
      }
    }
    loadData();
  }, []);

  const getTierInfo = (index: number) => {
    const tiers = [
      { name: 'ORO', tierClass: 'tier-gold', badgeClass: 'gold', boxClass: 'gold-bg', btnClass: 'card-btn-gold', Icon: PixelTrophyGold },
      { name: 'ARGENTO', tierClass: 'tier-silver', badgeClass: 'silver', boxClass: 'silver-bg', btnClass: 'card-btn-silver', Icon: PixelTrophySilver },
      { name: 'BRONZO', tierClass: 'tier-bronze', badgeClass: 'bronze', boxClass: 'bronze-bg', btnClass: 'card-btn-bronze', Icon: PixelTrophyBronze }
    ];
    return tiers[index % 3];
  };

  return (
    <div>
      {/* Cyber Hero Banner */}
      <div 
        style={{ 
          padding: '3.5rem 2rem', 
          textAlign: 'center', 
          marginBottom: '3rem', 
          background: 'linear-gradient(180deg, #0f172a 0%, #080c16 100%)', 
          border: '2px solid var(--neon-cyan)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 240, 255, 0.08)',
          position: 'relative'
        }}
      >
        <div className="hud-tag hud-tag-cyan" style={{ marginBottom: '1.2rem' }}>
          <Zap size={14} /> CYBER REGEX ENGINE v2.0
        </div>

        <h1 className="page-title-neon" style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>
          REGULATED EXPRESSION <br />
          <span style={{ color: 'var(--neon-pink)', textShadow: '0 0 15px rgba(236, 72, 153, 0.8)' }}>
            CHALLENGE MATRIX
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2.2rem' }}>
          RegexRiddle è la piattaforma di hacking logico per sviluppatori. Crea enigmi con stringhe di controllo segrete e scopri le espressioni regolari trasparenti al sistema.
        </p>

        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/riddles" className="btn btn-pill-pink" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            ESPLORA LE SFIDE <ArrowRight size={18} />
          </Link>
          <Link to="/rules" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            <Terminal size={18} /> MANUALE DI SISTEMA
          </Link>
        </div>
      </div>

      {/* Cyber Feature Cards */}
      <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
        <div className="cyber-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Terminal size={26} style={{ color: 'var(--neon-cyan)' }} />
            <span className="hud-tag hud-tag-cyan">ONLINE</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ffffff' }}>1. CREA ENIGMI SEGRETI</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Imposta la tua Regex di riferimento e fino a 10 stringhe di controllo positive e negative trasparenti al server.
          </p>
        </div>

        <div className="cyber-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Shield size={26} style={{ color: 'var(--neon-green)' }} />
            <span className="hud-tag hud-tag-green">TESTING</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ffffff' }}>2. TEST REAL-TIME</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Invia le tue regex. Il motore valuta istantaneamente l'esattezza dei match rispetto ai vettori di test segreti.
          </p>
        </div>

        <div className="cyber-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Trophy size={26} style={{ color: 'var(--neon-gold)' }} />
            <span className="hud-tag hud-tag-gold">SCORES</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ffffff' }}>3. SCALA LA CLASSIFICA</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Ottieni posizioni nel ranking globale accumulando sfide completate col minor numero medio di tentativi.
          </p>
        </div>
      </div>

      {/* Featured Riddles Cyber Showcase */}
      {featuredRiddles.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
            <h2 className="page-title-neon" style={{ fontSize: '1.8rem' }}>SFIDE IN EVIDENZA</h2>
            <Link to="/riddles" style={{ color: 'var(--neon-cyan)', fontWeight: 800, fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              VEDI TUTTE ({stats.riddlesCount}) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cards-grid">
            {featuredRiddles.map((riddle, index) => {
              const tier = getTierInfo(index);
              const TrophyIcon = tier.Icon;
              const isSolved = Number(riddle.is_solved_by_current_user) === 1;

              return (
                <div key={riddle.id} className={`riddle-card ${tier.tierClass}`}>
                  <div className={`card-tier-badge ${tier.badgeClass}`}>
                    <TrophyIcon />
                    <span>{tier.name}</span>
                  </div>

                  <div>
                    <h3 className="card-title">{riddle.title}</h3>
                    {isSolved && <div className="card-status-solved">RISOLTO</div>}
                    <p className="card-description">
                      {riddle.description.length > 90 ? `${riddle.description.substring(0, 90)}...` : riddle.description}
                    </p>

                    <div className={`card-example-box ${tier.boxClass}`}>
                      <div className="example-label">Esempio Positivo:</div>
                      <div className="example-line" style={{ fontWeight: 700 }}>{riddle.public_pos_example || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <div className="card-meta">
                      <span>Autore: <strong className="highlight">{riddle.author_name}</strong></span>
                      <span>Risolto da: <strong className="highlight">{riddle.solved_by_count ?? 0}</strong></span>
                    </div>

                    <Link to={`/riddles/${riddle.id}`} className={`card-btn ${tier.btnClass}`}>
                      {isSolved ? 'VISUALIZZA DETTAGLI' : 'INIZIA SFIDA'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
