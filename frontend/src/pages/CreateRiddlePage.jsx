import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Trash2, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateRiddlePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [secretRegex, setSecretRegex] = useState('');
  const [publicPosExample, setPublicPosExample] = useState('');
  const [publicNegExample, setPublicNegExample] = useState('');

  // Liste dinamiche per stringhe di controllo (fino a 10 ciascuna)
  const [controlPosStrings, setControlPosStrings] = useState(['', '']);
  const [controlNegStrings, setControlNegStrings] = useState(['', '']);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Gestione stringhe di controllo positive
  const handlePosChange = (index, value) => {
    const updated = [...controlPosStrings];
    updated[index] = value;
    setControlPosStrings(updated);
  };
  const addPosString = () => {
    if (controlPosStrings.length < 10) setControlPosStrings([...controlPosStrings, '']);
  };
  const removePosString = (index) => {
    if (controlPosStrings.length > 1) setControlPosStrings(controlPosStrings.filter((_, i) => i !== index));
  };

  // Gestione stringhe di controllo negative
  const handleNegChange = (index, value) => {
    const updated = [...controlNegStrings];
    updated[index] = value;
    setControlNegStrings(updated);
  };
  const addNegString = () => {
    if (controlNegStrings.length < 10) setControlNegStrings([...controlNegStrings, '']);
  };
  const removeNegString = (index) => {
    if (controlNegStrings.length > 1) setControlNegStrings(controlNegStrings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validazione front-end basilare
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
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Caricamento sessione utente...</div>;
  }

  if (!user) {
    return (

      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <AlertCircle size={40} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Accesso Richiesto</h2>
        <p style={{ color: 'var(--text-muted)' }}>Devi essere registrato ed autenticato per poter creare nuovi enigmi.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={28} style={{ color: 'var(--primary)' }} /> Crea un Nuovo Enigma
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Definisci la tua Regex segreta, gli esempi pubblici e fino a 10 stringhe di controllo trasparenti al sistema per validare le soluzioni altrui.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Info Generali ed Esempi Pubblici */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.2rem' }}>1. Informazioni Generali</h2>
          
          <div className="form-group">
            <label className="form-label">Titolo dell'Enigma</label>
            <input
              type="text"
              className="form-control"
              placeholder="es. Valida un indirizzo IP v4 valido"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrizione / Indizio</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Spiega l'obiettivo della sfida e quali vincoli devono rispettare le risposte..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">La tua Regex Segreta (Autore)</label>
            <input
              type="text"
              className="form-control code-input"
              placeholder="es. ^[0-9]{3}-[0-9]{2}$"
              value={secretRegex}
              onChange={(e) => setSecretRegex(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              N.B. Questa regex rimane segreta lato server e sarà usata per confrontare il comportamento rispetto alle stringhe di controllo.
            </span>
          </div>

          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#34d399' }}>✓ Esempio Pubblico Positivo</label>
              <input
                type="text"
                className="form-control code-input"
                placeholder="es. 123-45"
                value={publicPosExample}
                onChange={(e) => setPublicPosExample(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#fb7185' }}>✗ Esempio Pubblico Negativo</label>
              <input
                type="text"
                className="form-control code-input"
                placeholder="es. 12-345"
                value={publicNegExample}
                onChange={(e) => setPublicNegExample(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Stringhe di Controllo Segrete */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-purple)' }} /> 2. Stringhe di Controllo Segrete (max 10 ciascuna)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Queste stringhe rimangono segrete. Il sistema verificherà se le regex proposte dagli altri giocatori danno lo stesso risultato su queste stringhe.
          </p>

          <div className="grid-2">
            {/* Controllo Positive */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#34d399', fontSize: '0.9rem' }}>Stringhe Positive ({controlPosStrings.length}/10)</span>
                {controlPosStrings.length < 10 && (
                  <button type="button" onClick={addPosString} className="btn btn-secondary btn-sm">
                    <PlusCircle size={14} /> Aggiungi
                  </button>
                )}
              </div>

              {controlPosStrings.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control code-input"
                    placeholder={`Positiva #${idx + 1}`}
                    value={val}
                    onChange={(e) => handlePosChange(idx, e.target.value)}
                    required
                  />
                  {controlPosStrings.length > 1 && (
                    <button type="button" onClick={() => removePosString(idx)} className="btn btn-secondary btn-sm">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Controllo Negative */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#fb7185', fontSize: '0.9rem' }}>Stringhe Negative ({controlNegStrings.length}/10)</span>
                {controlNegStrings.length < 10 && (
                  <button type="button" onClick={addNegString} className="btn btn-secondary btn-sm">
                    <PlusCircle size={14} /> Aggiungi
                  </button>
                )}
              </div>

              {controlNegStrings.map((val, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control code-input"
                    placeholder={`Negativa #${idx + 1}`}
                    value={val}
                    onChange={(e) => handleNegChange(idx, e.target.value)}
                    required
                  />
                  {controlNegStrings.length > 1 && (
                    <button type="button" onClick={() => removeNegString(idx)} className="btn btn-secondary btn-sm">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
          <CheckCircle2 size={20} /> {submitting ? 'Pubblicazione enigma in corso...' : 'Pubblica Enigma'}
        </button>
      </form>
    </div>
  );
}
