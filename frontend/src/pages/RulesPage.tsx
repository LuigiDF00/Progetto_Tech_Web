import React from 'react';
import { HelpCircle, CheckCircle, XCircle, ShieldCheck, Target, Award } from 'lucide-react';

export default function RulesPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <HelpCircle size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Come Funziona RegexRiddle</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Guida completa alle regole del gioco, alla creazione di sfide e alla risoluzione di enigmi basati su Espressioni Regolari.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Sezione 1: Il Concetto del Gioco */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Target size={24} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>1. L'Obiettivo del Gioco</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            In <strong>RegexRiddle</strong>, ogni sfida consiste in un enigma basato su un'<strong>Espressione Regolare (Regex) segreta</strong> definita dall'autore della sfida.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            L'obiettivo per i giocatori è scoprire una Regex che si comporti esattamente allo stesso modo della Regex segreta dell'autore rispetto a un insieme di <strong>stringhe di controllo segrete</strong>.
          </p>
        </div>

        {/* Sezione 2: Creazione di una Sfida */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>2. Come Creare una Sfida</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Gli utenti registrati possono accedere all'area <strong>Crea Enigma</strong> e compilare i seguenti elementi:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-indigo">Regex Segreta</span>
              <span>L'espressione regolare originale (rimane nascosta agli altri utenti).</span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-emerald">Esempio Positivo Pubblico</span>
              <span>Una stringa visibile a tutti che la tua Regex DEVE soddisfare.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-rose">Esempio Negativo Pubblico</span>
              <span>Una stringa visibile a tutti che la tua Regex NON deve soddisfare.</span>
            </li>
            <li style={{ display: 'flex', gap: '0.6rem' }}>
              <span className="badge badge-amber">Stringhe di Controllo Segrete</span>
              <span>Fino a 10 stringhe positive e 10 stringhe negative usate dal sistema per validare le risposte degli altri giocatori.</span>
            </li>
          </ul>
        </div>

        {/* Sezione 3: Tentativi e Soluzione */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckCircle size={24} style={{ color: 'var(--accent-emerald)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>3. Come Risolvere un Enigma</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Quando un giocatore inserisce una propria espressione regolare per tentare la risoluzione:
          </p>
          <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.5rem' }}>Verifica del Server:</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Il server valuta la regex proposta su tutte le stringhe di controllo segrete e restituisce il feedback:
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
                <CheckCircle size={16} /> Stringhe Positive Soddisfatte (es. 8/10)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185' }}>
                <XCircle size={16} /> Stringhe Negative Rifiutate (es. 10/10)
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            L'enigma si considera <strong>Risolto con Successo 🎉</strong> solo quando la tua Regex soddisfa <strong>100%</strong> delle stringhe di controllo positive e rifiuta <strong>100%</strong> delle stringhe di controllo negative!
          </p>
        </div>

        {/* Sezione 4: Classifica e Statistiche */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Award size={24} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>4. Punteggi e Classifica</h2>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            I giocatori autenticati compaiono nella <strong>Classifica Globale</strong> ordinata in base a:
          </p>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><strong>Numero totale di enigmi risolti</strong> con successo.</li>
            <li><strong>Minor numero medio di tentativi</strong> impiegati per enigma.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
