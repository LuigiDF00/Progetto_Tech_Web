import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>© 2026 <strong>RegexRiddle</strong> - Progetto per l'esame di Tecnologie Web</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-dim)' }}>
          Università degli Studi di Napoli Federico II - Corso di Laurea in Informatica
        </p>
      </div>
    </footer>
  );
}
