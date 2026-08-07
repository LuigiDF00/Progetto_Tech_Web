import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Riddle, Attempt } from '../types';
import { Terminal, Send, CheckCircle2, XCircle, AlertCircle, ArrowLeft, History, Sparkles } from 'lucide-react';

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
    return <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Caricamento enigma in corso...</div>;
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/riddles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Torna alle sfide
      </Link>

      {/* Scheda Enigma Header */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{riddle.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Creato da <strong>{riddle.author_name}</strong> il {new Date(riddle.created_at).toLocaleDateString('it-IT')}
            </p>
          </div>
          {riddle.is_solved && (
            <div className="badge badge-emerald" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} /> Enigma Risolto!
            </div>
          )}
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          {riddle.description}
        </p>

        {/* Esempi Pubblici */}
        <div className="grid-2">
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              ✓ Esempio Pubblico Positivo (Deve Combaciare)
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: '#6ee7b7' }}>
              {riddle.public_pos_example}
            </code>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div style={{ color: '#fb7185', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              ✗ Esempio Pubblico Negativo (NON Deve Combaciare)
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: '#fca5a5' }}>
              {riddle.public_neg_example}
            </code>
          </div>
        </div>
      </div>

      {/* Editor Tentativo / Input Regex */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={22} style={{ color: 'var(--primary)' }} /> Proponi la tua Espressione Regolare
        </h2>

        {!user ? (
          <div className="alert alert-error">
            Per inviare tentativi di risoluzione devi prima accedere o registrarti.
          </div>
        ) : (
          <form onSubmit={handleSubmitAttempt}>
            <div className="form-group">
              <label className="form-label">La tua Regex Tentativo:</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control code-input"
                  placeholder="es. ^[a-zA-Z0-9]+$"
                  value={proposedRegex}
                  onChange={(e) => setProposedRegex(e.target.value)}
                  disabled={submitting}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={16} /> {submitting ? 'In corso...' : 'Invia'}
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

        {/* Feedback Risultato Ultimo Tentativo */}
        {attemptFeedback && (
          <div style={{ marginTop: '1.5rem', background: attemptFeedback.result.is_solved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.9)', border: attemptFeedback.result.is_solved ? '1px solid #10b981' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {attemptFeedback.result.is_solved ? (
                <Sparkles size={24} style={{ color: '#34d399' }} />
              ) : (
                <AlertCircle size={22} style={{ color: 'var(--accent-amber)' }} />
              )}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: attemptFeedback.result.is_solved ? '#34d399' : 'var(--text-main)' }}>
                {attemptFeedback.message}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                <span>Controllo Positivo: <strong>{attemptFeedback.result.pos_passed_count} / {attemptFeedback.result.total_pos_count}</strong> soddisfatti</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XCircle size={18} style={{ color: '#fb7185' }} />
                <span>Controllo Negativo: <strong>{attemptFeedback.result.neg_passed_count} / {attemptFeedback.result.total_neg_count}</strong> rifiutati</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Storico Tentativi Utente */}
      {user && attempts.length > 0 && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} style={{ color: 'var(--text-muted)' }} /> I Tuoi Tentativi Effettuati ({attempts.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attempts.map((att, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', padding: '0.85rem 1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#38bdf8' }}>
                    {att.proposed_regex}
                  </code>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#34d399' }}>
                    Pos: {att.pos_passed_count}/{att.total_pos_count}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#fb7185' }}>
                    Neg: {att.neg_passed_count}/{att.total_neg_count}
                  </span>
                  {Number(att.is_solved) === 1 || att.is_solved === true ? (
                    <span className="badge badge-emerald">Risolto</span>
                  ) : (
                    <span className="badge badge-rose">Errato</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
