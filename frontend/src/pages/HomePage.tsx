import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Riddle } from '../types';
import { Puzzle, Trophy, Terminal, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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

  return (
    <div>
      {/* Hero Section */}
      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '1.2rem' }}>
          <Sparkles size={14} /> Sfida la tua mente con le RegEx
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.2rem', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Metti alla prova le tue abilità con <br />
          <span style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Espressioni Regolari Segrete
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2rem' }}>
          RegexRiddle è la piattaforma di sfide logiche in cui crei enigmi con stringhe di controllo e risolvi i rompicapo ideati dagli altri sviluppatori.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/riddles" className="btn btn-primary btn-lg">
            <Puzzle size={20} /> Esplora Enigmi
          </Link>
          <Link to="/rules" className="btn btn-secondary btn-lg">
            <Terminal size={20} /> Come Funziona
          </Link>
        </div>
      </div>

      {/* Grid Caratteristiche */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Terminal size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Crea Enigmi Segreti</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Definisci la tua Regex segreta, aggiungi fino a 10 stringhe di controllo positive e negative e sfida gli altri a scoprirla.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Puzzle size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Test in Tempo Reale</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Proponi le tue regex per risolvere gli enigmi. Il sistema verifica istantaneamente il comportamento sulle stringhe segrete.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Trophy size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Scala la Classifica</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Guadagna posizioni risolvendo più enigmi nel minor numero medio di tentativi possibili.
          </p>
        </div>
      </div>

      {/* Anteprima Enigmi Recenti */}
      {featuredRiddles.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Sfide In Evidenza</h2>
            <Link to="/riddles" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Vedi tutte <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {featuredRiddles.map((riddle) => (
              <div key={riddle.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{riddle.title}</h3>
                    {riddle.is_solved_by_current_user === 1 && (
                      <span className="badge badge-emerald"><CheckCircle2 size={12} /> Risolto</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {riddle.description.length > 90 ? `${riddle.description.substring(0, 90)}...` : riddle.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                    Autore: <strong>{riddle.author_name}</strong>
                  </div>
                  <Link to={`/riddles/${riddle.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Prova a Risolvere
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
