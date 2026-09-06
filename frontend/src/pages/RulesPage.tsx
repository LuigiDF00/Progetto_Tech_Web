import React from 'react';
import { HelpCircle, CheckCircle, XCircle, ShieldCheck, Target, Award, Terminal, Zap } from 'lucide-react';

export default function RulesPage() {
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {/* Title Header */}
      <div className="cyber-stat-card" style={{ marginBottom: '2.5rem', textAlign: 'center', padding: '2.5rem 1.5rem', border: '2px solid var(--neon-cyan)' }}>
        <div className="hud-tag hud-tag-cyan" style={{ marginBottom: '0.8rem' }}>
          <HelpCircle size={14} /> SYSTEM MANUAL // REGS PROTOCOL
        </div>
        <h1 className="page-title-neon" style={{ fontSize: '2.6rem', color: '#ffffff' }}>MANUALE REGEXRIDDLE</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '700px', margin: '0.4rem auto 0' }}>
          Guida completa al funzionamento del motore di sfida, alla creazione degli enigmi ed al punteggio del ranking.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
        {/* Module 01 */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
            <span className="hud-tag hud-tag-cyan" style={{ fontSize: '0.85rem' }}>PROTOCOL 01</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>L'OBIETTIVO DEL GIOCO</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            In <strong>RegexRiddle</strong>, ciascuna sfida si basa su un'<strong>Espressione Regolare (Regex) segreta</strong> creata dall'autore dell'enigma.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Il tuo compito come giocatore è scoprire una Regex che si comporti esattamente allo stesso modo della Regex dell'autore rispetto ad un insieme di <strong>stringhe di controllo segrete</strong>.
          </p>
        </div>

        {/* Module 02 */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
            <span className="hud-tag hud-tag-purple" style={{ fontSize: '0.85rem' }}>PROTOCOL 02</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>COME CREARE UNA SFIDA</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
            Gli utenti registrati possono accedere al wizard <strong>Crea Enigma</strong> e configurare i 4 elementi fondamentali:
          </p>
          <div className="grid-2">
            <div style={{ background: '#050811', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="hud-tag hud-tag-pink" style={{ marginBottom: '0.4rem' }}>1. REGEX SEGRETA</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>L'espressione originale (visibile solo al server).</p>
            </div>

            <div style={{ background: '#050811', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="hud-tag hud-tag-green" style={{ marginBottom: '0.4rem' }}>2. ESEMPI PUBBLICI</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>1 Esempio Positivo e 1 Esempio Negativo visibili a tutti.</p>
            </div>

            <div style={{ background: '#050811', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)', gridColumn: 'span 2' }}>
              <div className="hud-tag hud-tag-gold" style={{ marginBottom: '0.4rem' }}>3. VETTORI DI CONTROLLO SEGRETI</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Fino a 10 stringhe positive e 10 negative trasparenti al sistema per validare le risposte degli altri giocatori.</p>
            </div>
          </div>
        </div>

        {/* Module 03 */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
            <span className="hud-tag hud-tag-green" style={{ fontSize: '0.85rem' }}>PROTOCOL 03</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>VERIFICA DEL SERVER &amp; CRITERIO SOLUZIONE</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Quando proponi la tua Regex nella console dell'enigma, il server la esegue su tutte le stringhe di controllo segrete:
          </p>

          <div className="grid-2" style={{ marginBottom: '1.2rem' }}>
            <div className="crt-terminal crt-terminal-pos">
              <div className="crt-terminal-header">MATCH POSITIVI</div>
              <div style={{ fontSize: '0.9rem', color: '#34d399' }}>
                ✓ Devono soddisfare il 100% delle stringhe di controllo positive
              </div>
            </div>

            <div className="crt-terminal crt-terminal-neg">
              <div className="crt-terminal-header">MATCH NEGATIVI</div>
              <div style={{ fontSize: '0.9rem', color: '#fb7185' }}>
                ✗ Devono scartare il 100% delle stringhe di controllo negative
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--neon-green)', fontWeight: 800, fontFamily: 'var(--font-hud)', fontSize: '0.95rem' }}>
            🎉 L'ENIGMA SI CONSIDERA RISOLTO SOLO QUANDO ENTRAMBI I CONTROLLI RAGGIUNGONO IL 100% DI ACCURATEZZA!
          </p>
        </div>

        {/* Module 04 */}
        <div className="cyber-stat-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
            <span className="hud-tag hud-tag-gold" style={{ fontSize: '0.85rem' }}>PROTOCOL 04</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>ALGORITMO CLASSIFICA GLOBAL HIGH SCORES</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Il ranking globale ordina gli utenti registrati secondo i seguenti criteri:
          </p>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.6rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem' }}>
            <li><strong>Maggior numero di enigmi distinti risolti con successo.</strong></li>
            <li><strong>Minor numero medio di tentativi per enigma risolto.</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
