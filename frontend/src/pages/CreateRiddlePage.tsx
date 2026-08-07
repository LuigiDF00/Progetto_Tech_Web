import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Trash2, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateRiddlePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [secretRegex, setSecretRegex] = useState<string>('');
  const [publicPosExample, setPublicPosExample] = useState<string>('');
  const [publicNegExample, setPublicNegExample] = useState<string>('');

  const [controlPosStrings, setControlPosStrings] = useState<string[]>(['', '']);
  const [controlNegStrings, setControlNegStrings] = useState<string[]>(['', '']);

  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handlePosChange = (index: number, value: string) => {
    const updated = [...controlPosStrings];
    updated[index] = value;
    setControlPosStrings(updated);
  };
  const addPosString = () => {
    if (controlPosStrings.length < 10) setControlPosStrings([...controlPosStrings, '']);
  };
  const removePosString = (index: number) => {
    if (controlPosStrings.length > 1) setControlPosStrings(controlPosStrings.filter((_, i) => i !== index));
  };

  const handleNegChange = (index: number, value: string) => {
    const updated = [...controlNegStrings];
    updated[index] = value;
    setControlNegStrings(updated);
  };
  const addNegString = () => {
    if (controlNegStrings.length < 10) setControlNegStrings([...controlNegStrings, '']);
  };
  const removeNegString = (index: number) => {
    if (controlNegStrings.length > 1) setControlNegStrings(controlNegStrings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const posFiltered = controlPosStrings.map(s => s.trim()).filter(Boolean);
    const negFiltered = controlNegStrings.map(s => s.trim()).filter(Boolean);

    if (posFiltered.length === 0 || negFiltered.length === 0) {
      setError('Inserisci almeno 1 stringa di controllo positiva e 1 negativa.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.createRiddle({
        title,
        description,
        secret_regex: secretRegex,
        public_pos_example: publicPosExample,
        public_neg_example: publicNegExample,
        control_pos_strings: posFiltered,
        control_neg_strings: negFiltered
      });

      navigate(`/riddles/${result.riddle_id}`);
    } catch (err: any) {
      setError(err.message || 'Errore nella creazione dell\'enigma');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>AUTENTICAZIONE IN CORSO...</div>;
  }

  if (!user) {
    return (
      <div className="cyber-stat-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--neon-pink)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.5rem' }}>ACCESSO NEGATO</h2>
        <p style={{ color: 'var(--text-muted)' }}>Devi essere un operatore autenticato per pubblicare nuovi enigmi di sistema.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="cyber-stat-card" style={{ marginBottom: '2rem', padding: '2rem', border: '2px solid var(--neon-cyan)' }}>
        <div className="hud-tag hud-tag-cyan" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> SYSTEM PROTOCOL // CREATOR WIZARD
        </div>
        <h1 className="page-title-neon" style={{ fontSize: '2.4rem' }}>CREA UN NUOVO ENIGMA</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          Definisci la tua Regex segreta, gli esempi pubblici e fino a 10 stringhe di controllo segrete usate dal server per validare le soluzioni degli altri utenti.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Info Generali */}
        <div className="cyber-stat-card" style={{ marginBottom: '1.5rem', padding: '1.8rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.2rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            1. INFORMAZIONI GENERALI &amp; ESEMPI PUBBLICI
          </h2>
          
          <div className="form-group">
            <label className="form-label" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>TITOLO DELL'ENIGMA</label>
            <input
              type="text"
              className="form-control"
              placeholder="es. Validazione Indirizzo IPv4 Valido"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>DESCRIZIONE / INDIZIO</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Spiega l'obiettivo della sfida e quali vincoli devono rispettare le soluzioni..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--neon-pink)', fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>
              REGULATION EXPR. SEGRETA (AUTORE)
            </label>
            <input
              type="text"
              className="form-control code-input"
              style={{ borderColor: 'var(--neon-pink)' }}
              placeholder="es. ^[0-9]{3}-[0-9]{2}$"
              value={secretRegex}
              onChange={(e) => setSecretRegex(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              N.B. Questa regex rimane segreta lato server e serve per verificare la correttezza del comportamento.
            </span>
          </div>

          <div className="grid-2" style={{ marginTop: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>
                ✓ ESEMPIO POSITIVO PUBBLICO
              </label>
              <input
                type="text"
                className="form-control code-input"
                style={{ borderColor: 'var(--neon-green)' }}
                placeholder="es. 123-45"
                value={publicPosExample}
                onChange={(e) => setPublicPosExample(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--neon-pink)', fontFamily: 'var(--font-hud)', fontSize: '0.8rem' }}>
                ✗ ESEMPIO NEGATIVO PUBBLICO
              </label>
              <input
                type="text"
                className="form-control code-input"
                style={{ borderColor: 'var(--neon-pink)' }}
                placeholder="es. 12-345"
                value={publicNegExample}
                onChange={(e) => setPublicNegExample(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Stringhe di Controllo Segrete */}
        <div className="cyber-stat-card" style={{ marginBottom: '2rem', padding: '1.8rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--neon-purple)' }} /> 2. VETTORI DI CONTROLLO SEGRETI (MAX 10 CIASCUNO)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Queste stringhe rimangono completamente segrete. Il server confronterà il risultato delle regex proposte da altri utenti con quello della tua regex originale.
          </p>

          <div className="grid-2">
            {/* Positive strings bank */}
            <div className="crt-terminal crt-terminal-pos" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--neon-green)', fontFamily: 'var(--font-hud)', fontSize: '0.85rem' }}>
                  STRINGHE POSITIVE ({controlPosStrings.length}/10)
                </span>
                {controlPosStrings.length < 10 && (
                  <button type="button" onClick={addPosString} className="pill-filter pill-filter-green" style={{ padding: '0.2rem 0.75rem', fontSize: '0.75rem' }}>
                    <PlusCircle size={12} /> ADD
                  </button>
                )}
              </div>

              {controlPosStrings.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control code-input"
                    style={{ background: '#020d09', borderColor: 'var(--neon-green)' }}
                    placeholder={`Positiva #${idx + 1}`}
                    value={val}
                    onChange={(e) => handlePosChange(idx, e.target.value)}
                    required
                  />
                  {controlPosStrings.length > 1 && (
                    <button type="button" onClick={() => removePosString(idx)} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Negative strings bank */}
            <div className="crt-terminal crt-terminal-neg" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--neon-pink)', fontFamily: 'var(--font-hud)', fontSize: '0.85rem' }}>
                  STRINGHE NEGATIVE ({controlNegStrings.length}/10)
                </span>
                {controlNegStrings.length < 10 && (
                  <button type="button" onClick={addNegString} className="pill-filter pill-filter-pink" style={{ padding: '0.2rem 0.75rem', fontSize: '0.75rem' }}>
                    <PlusCircle size={12} /> ADD
                  </button>
                )}
              </div>

              {controlNegStrings.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control code-input"
                    style={{ background: '#0e030a', borderColor: 'var(--neon-pink)' }}
                    placeholder={`Negativa #${idx + 1}`}
                    value={val}
                    onChange={(e) => handleNegChange(idx, e.target.value)}
                    required
                  />
                  {controlNegStrings.length > 1 && (
                    <button type="button" onClick={() => removeNegString(idx)} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-pill-pink" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={submitting}>
          <CheckCircle2 size={20} /> {submitting ? 'PUBBLICAZIONE IN CORSO...' : 'PUBBLICA ENIGMA IN RETE'}
        </button>
      </form>
    </div>
  );
}
