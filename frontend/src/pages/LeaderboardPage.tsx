import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { PixelTrophyGold, PixelTrophySilver, PixelTrophyBronze } from '../components/PixelIcons';
import { Trophy, Award, Zap, CheckCircle2 } from 'lucide-react';

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

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Title Header */}
      <div className="cyber-stat-card" style={{ marginBottom: '2.5rem', textAlign: 'center', padding: '2.5rem 1.5rem', border: '2px solid var(--neon-gold)' }}>
        <div className="hud-tag hud-tag-gold" style={{ marginBottom: '0.8rem' }}>
          <Trophy size={14} /> HALL OF FAME // GLOBAL HIGH SCORES
        </div>
        <h1 className="page-title-neon" style={{ fontSize: '2.6rem', color: '#ffffff' }}>CLASSIFICA GIOCATORI</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0.4rem auto 0' }}>
          I migliori risolutori di enigmi regolati ordinati per numero di enigmi risolti con successo e minore media tentativi.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>CARICAMENTO CLASSIFICA IN CORSO...</div>
      ) : leaderboard.length === 0 ? (
        <div className="cyber-stat-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          Nessun giocatore ha ancora completato sfide in classifica.
        </div>
      ) : (
        <>
          {/* Top 3 Cyber Podium Showcase */}
          {leaderboard.length >= 1 && (
            <div className="podium-grid">
              {/* Silver #2 */}
              {top2 ? (
                <div className="podium-card podium-card-silver">
                  <div className="podium-rank-badge" style={{ color: '#34d399' }}>#2 SILVER</div>
                  <PixelTrophySilver />
                  <div style={{ marginTop: '0.8rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{top2.username}</h3>
                    <div className="hud-tag hud-tag-green" style={{ marginTop: '0.4rem' }}>
                      <CheckCircle2 size={12} /> {top2.riddles_solved ?? top2.solved_count ?? 0} RISOLTI
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--neon-cyan)', marginTop: '0.8rem', fontWeight: 700 }}>
                    TENTATIVI MEDI: {top2.avg_attempts ? Number(top2.avg_attempts).toFixed(1) : '-'}
                  </div>
                </div>
              ) : <div />}

              {/* Gold #1 Champion */}
              {top1 && (
                <div className="podium-card podium-card-gold">
                  <div className="podium-rank-badge" style={{ color: 'var(--neon-gold)' }}>#1 CHAMPION</div>
                  <PixelTrophyGold />
                  <div style={{ marginTop: '0.8rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{top1.username}</h3>
                    <div className="hud-tag hud-tag-gold" style={{ marginTop: '0.4rem' }}>
                      <Zap size={12} /> {top1.riddles_solved ?? top1.solved_count ?? 0} RISOLTI
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--neon-gold)', marginTop: '0.8rem', fontWeight: 800 }}>
                    TENTATIVI MEDI: {top1.avg_attempts ? Number(top1.avg_attempts).toFixed(1) : '-'}
                  </div>
                </div>
              )}

              {/* Bronze #3 */}
              {top3 ? (
                <div className="podium-card podium-card-bronze">
                  <div className="podium-rank-badge" style={{ color: '#c084fc' }}>#3 BRONZE</div>
                  <PixelTrophyBronze />
                  <div style={{ marginTop: '0.8rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{top3.username}</h3>
                    <div className="hud-tag hud-tag-pink" style={{ marginTop: '0.4rem' }}>
                      <CheckCircle2 size={12} /> {top3.riddles_solved ?? top3.solved_count ?? 0} RISOLTI
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--neon-cyan)', marginTop: '0.8rem', fontWeight: 700 }}>
                    TENTATIVI MEDI: {top3.avg_attempts ? Number(top3.avg_attempts).toFixed(1) : '-'}
                  </div>
                </div>
              ) : <div />}
            </div>
          )}

          {/* Full High Scores Arcade Table */}
          <div className="cyber-stat-card" style={{ padding: '1.2rem' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>RANK</th>
                  <th>GIOCATORE</th>
                  <th style={{ textAlign: 'center' }}>ENIGMI RISOLTI</th>
                  <th style={{ textAlign: 'center' }}>TENTATIVI MEDI</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => {
                  const rank = index + 1;
                  const solved = item.riddles_solved ?? item.solved_count ?? 0;

                  return (
                    <tr key={item.user_id || index}>
                      <td style={{ fontWeight: 900, fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
                        {rank === 1 && <span style={{ color: 'var(--neon-gold)' }}>#1</span>}
                        {rank === 2 && <span style={{ color: '#34d399' }}>#2</span>}
                        {rank === 3 && <span style={{ color: '#c084fc' }}>#3</span>}
                        {rank > 3 && <span style={{ color: 'var(--text-muted)' }}>#{rank}</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div className="avatar-pixel-frame" style={{ width: '36px', height: '36px' }}>
                            {item.avatar_url ? (
                              <img src={item.avatar_url} alt={item.username} className="avatar-img" />
                            ) : (
                              <span className="avatar-placeholder-pixel">
                                {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>{item.username}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--neon-green)', fontFamily: 'var(--font-hud)' }}>
                        {solved}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--neon-cyan)', fontFamily: 'var(--font-hud)' }}>
                        {item.avg_attempts ? Number(item.avg_attempts).toFixed(1) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
