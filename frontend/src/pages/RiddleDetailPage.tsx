import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Riddle, Attempt } from '../types';
import { Terminal, Send, CheckCircle2, XCircle, AlertCircle, ArrowLeft, History, Zap, ShieldCheck } from 'lucide-react';

export default function RiddleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();

  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [proposedRegex, setProposedRegex] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [attemptFeedback, setAttemptFeedback] = useState<{ message: string; result: Attempt } | null>(null);
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    async function loadRiddle() {
      if (!id) return;
      try {
        const data = await api.getRiddleById(id);
        setRiddle(data.riddle);
        setAttempts(data.attempts || []);
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento enigma');
      } finally {
        setLoading(false);
      }
    }
    loadRiddle();
  }, [id]);

  const handleSubmitAttempt = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !proposedRegex.trim()) return;

    setSubmitting(true);
    setSubmitError('');
    setAttemptFeedback(null);

    try {
      const data = await api.submitAttempt(id, proposedRegex);
      setAttemptFeedback(data);

      const updatedData = await api.getRiddleById(id);
      setRiddle(updatedData.riddle);
      setAttempts(updatedData.attempts || []);
    } catch (err: any) {
      setSubmitError(err.message || 'Errore nell\'invio del tentativo');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>CARICAMENTO CONSOLE IN CORSO...</div>;
  }

  if (error || !riddle) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div className="alert alert-error" style={{ justifyContent: 'center' }}>{error || 'Enigma non trovato.'}</div>
        <Link to="/riddles" className="btn btn-secondary">
          <ArrowLeft size={16} /> Torna alla galleria
        </Link>
      </div>
    );
  }

  const isSolved = Number(riddle.is_solved) === 1 || Number(riddle.is_solved_by_current_user) === 1;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/riddles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-hud)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> TORNA ALLA GALLERIA SFIDE
      </Link>

      {/* Cyber Header Card */}
      <div className="cyber-stat-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div className="hud-tag hud-tag-cyan" style={{ marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} /> ENIGMA #{riddle.id}
            </div>
            <h1 className="page-title-neon" style={{ fontSize: '2.2rem', margin: '0.3rem 0' }}>{riddle.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              AUTORE: <strong style={{ color: 'var(--neon-cyan)' }}>{riddle.author_name}</strong> • DATA: {new Date(riddle.created_at).toLocaleDateString('it-IT')}
            </p>
          </div>

          {isSolved && (
            <div className="hud-tag hud-tag-green" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> RISOLTO CON SUCCESSO
            </div>
          )}
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)', margin: '1.2rem 0 1.8rem' }}>
          {riddle.description}
        </p>

        {/* Dual CRT Test Terminals */}
        <div className="grid-2">
          {/* Pos Terminal */}
          <div className="crt-terminal crt-terminal-pos">
            <div className="crt-terminal-header">
              <span>✓ ESEMPIO POSITIVO PUBBLICO</span>
              <span>MATCH REQUIRED</span>
            </div>
            <code style={{ fontSize: '1.15rem', color: '#34d399', wordBreak: 'break-all' }}>
              {riddle.public_pos_example}
            </code>
          </div>

          {/* Neg Terminal */}
          <div className="crt-terminal crt-terminal-neg">
            <div className="crt-terminal-header">
              <span>✗ ESEMPIO NEGATIVO PUBBLICO</span>
              <span>MUST FAIL</span>
            </div>
            <code style={{ fontSize: '1.15rem', color: '#fb7185', wordBreak: 'break-all' }}>
              {riddle.public_neg_example}
            </code>
          </div>
        </div>
      </div>

      {/* Cyber Hacking Console Input */}
      <div className="cyber-stat-card" style={{ marginBottom: '2rem', padding: '2rem', border: '2px solid var(--neon-pink)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff' }}>
          <Terminal size={24} style={{ color: 'var(--neon-pink)' }} /> CONSOLE INSERIMENTO REGEX
        </h2>

        {!user ? (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>ACCESSO RICHIESTO: Effettua il login per poter inviare tentativi di hacking sull'enigma.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitAttempt}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--neon-pink)', fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>
                &gt; ENTER PROPOSED REGEX PATTERN:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-control code-input"
                  style={{ flex: 1, minWidth: '280px', borderColor: 'var(--neon-pink)', background: '#050811' }}
                  placeholder="es. ^[0-9]{4}$"
                  value={proposedRegex}
                  onChange={(e) => setProposedRegex(e.target.value)}
                  disabled={submitting}
                  required
                />
                <button type="submit" className="btn btn-pill-pink" disabled={submitting}>
                  <Send size={16} /> {submitting ? 'VALIDAZIONE...' : 'INVIA RISPOSTA'}
                </button>
              </div>
            </div>
          </form>
        )}

        {submitError && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <AlertCircle size={18} /> <span>{submitError}</span>
          </div>
        )}

        {/* Live Feedback Dashboard */}
        {attemptFeedback && (
          <div 
            style={{ 
              marginTop: '1.8rem', 
              background: attemptFeedback.result.is_solved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(236, 72, 153, 0.12)', 
              border: attemptFeedback.result.is_solved ? '2px solid var(--neon-green)' : '2px solid var(--neon-pink)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.4rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {attemptFeedback.result.is_solved ? (
                <Zap size={26} style={{ color: 'var(--neon-green)' }} />
              ) : (
                <AlertCircle size={24} style={{ color: 'var(--neon-pink)' }} />
              )}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-hud)', color: attemptFeedback.result.is_solved ? 'var(--neon-green)' : 'var(--neon-pink)' }}>
                {attemptFeedback.message}
              </h3>
            </div>

            <div className="grid-2" style={{ marginTop: '1rem' }}>
              {/* Positive progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neon-green)' }}>
                  <span>CONTROLLI POSITIVI</span>
                  <span>{attemptFeedback.result.pos_passed_count} / {attemptFeedback.result.total_pos_count}</span>
                </div>
                <div className="cyber-progress-track">
                  <div 
                    className="cyber-progress-fill cyber-progress-fill-pos" 
                    style={{ width: `${(attemptFeedback.result.pos_passed_count / Math.max(1, attemptFeedback.result.total_pos_count)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Negative progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--neon-pink)' }}>
                  <span>CONTROLLI NEGATIVI</span>
                  <span>{attemptFeedback.result.neg_passed_count} / {attemptFeedback.result.total_neg_count}</span>
                </div>
                <div className="cyber-progress-track">
                  <div 
                    className="cyber-progress-fill cyber-progress-fill-neg" 
                    style={{ width: `${(attemptFeedback.result.neg_passed_count / Math.max(1, attemptFeedback.result.total_neg_count)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attempt History Log */}
      {user && attempts.length > 0 && (
        <div className="cyber-stat-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff' }}>
            <History size={20} style={{ color: 'var(--neon-cyan)' }} /> STORICO TENTATIVI UTENTE ({attempts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attempts.map((att, idx) => {
              const solved = Number(att.is_solved) === 1 || att.is_solved === true;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#050811', 
                    padding: '0.9rem 1.2rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    flexWrap: 'wrap', 
                    gap: '0.75rem' 
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: 'var(--neon-cyan)' }}>
                    {att.proposed_regex}
                  </code>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neon-green)', fontWeight: 700 }}>
                      POS: {att.pos_passed_count}/{att.total_pos_count}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 700 }}>
                      NEG: {att.neg_passed_count}/{att.total_neg_count}
                    </span>
                    {solved ? (
                      <span className="hud-tag hud-tag-green">SOLVED</span>
                    ) : (
                      <span className="hud-tag hud-tag-pink">FAILED</span>
                    )}
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
