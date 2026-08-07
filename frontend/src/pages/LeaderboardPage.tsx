import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await api.getLeaderboard();
        setLeaderboard(data.leaderboard || []);
      } catch (err: any) {
        setError(err.message || 'Errore nel caricamento classifica');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Trophy size={48} style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Classifica Globale Giocatori</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          I migliori risolutori di enigmi della piattaforma ordinati per enigmi risolti e minor media tentativi.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Caricamento classifica...</div>
      ) : leaderboard.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          Nessun utente ha ancora completato sfide in classifica.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem' }}>Posizione</th>
                  <th style={{ padding: '1rem' }}>Giocatore</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Enigmi Risolti</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Tentativi Medi</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => {
                  const rank = index + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;
                  const solved = item.riddles_solved ?? item.solved_count ?? 0;

                  return (
                    <tr
                      key={item.user_id || index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isTop1 ? 'rgba(245, 158, 11, 0.08)' : isTop2 ? 'rgba(148, 163, 184, 0.08)' : isTop3 ? 'rgba(180, 83, 9, 0.08)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                        {isTop1 && <Award size={20} style={{ color: '#f59e0b', verticalAlign: 'middle', marginRight: '6px' }} />}
                        {isTop2 && <Award size={20} style={{ color: '#94a3b8', verticalAlign: 'middle', marginRight: '6px' }} />}
                        {isTop3 && <Award size={20} style={{ color: '#b45309', verticalAlign: 'middle', marginRight: '6px' }} />}
                        #{rank}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {item.avatar_url ? (
                            <img src={item.avatar_url} alt={item.username} className="avatar-img" style={{ width: '34px', height: '34px' }} />
                          ) : (
                            <div className="avatar-placeholder" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                              {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700 }}>{item.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {solved}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        {item.avg_attempts ? Number(item.avg_attempts).toFixed(1) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
