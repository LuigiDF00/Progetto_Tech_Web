const db = require('../db/database');

/**
 * Calcola e restituisce la classifica globale degli utenti.
 * Ordinata per:
 * 1. Numero di enigmi unici risolti (DESC)
 * 2. Minor numero medio di tentativi impiegati per enigma (ASC)
 */
function getGlobalLeaderboard() {
  const query = `
    SELECT 
      u.id AS user_id,
      u.username,
      u.avatar_url,
      COALESCE(solved.solved_count, 0) AS solved_count,
      COALESCE(created.created_count, 0) AS created_count,
      COALESCE(attempts_stats.avg_attempts, 0) AS avg_attempts
    FROM users u
    LEFT JOIN (
      SELECT user_id, COUNT(DISTINCT riddle_id) AS solved_count
      FROM attempts
      WHERE is_solved = 1
      GROUP BY user_id
    ) solved ON u.id = solved.user_id
    LEFT JOIN (
      SELECT author_id, COUNT(id) AS created_count
      FROM riddles
      GROUP BY author_id
    ) created ON u.id = created.author_id
    LEFT JOIN (
      SELECT user_id, ROUND(CAST(COUNT(id) AS FLOAT) / COUNT(DISTINCT riddle_id), 2) AS avg_attempts
      FROM attempts
      GROUP BY user_id
    ) attempts_stats ON u.id = attempts_stats.user_id
    ORDER BY solved_count DESC, avg_attempts ASC, username ASC
  `;

  return db.prepare(query).all();
}

/**
 * Restituisce le statistiche dettagliate di un singolo utente
 */
function getUserStats(userId) {
  const user = db.prepare('SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return null;

  const solvedCount = db.prepare(`
    SELECT COUNT(DISTINCT riddle_id) as count FROM attempts WHERE user_id = ? AND is_solved = 1
  `).get(userId).count;

  const createdCount = db.prepare(`
    SELECT COUNT(id) as count FROM riddles WHERE author_id = ?
  `).get(userId).count;

  const totalAttempts = db.prepare(`
    SELECT COUNT(id) as count FROM attempts WHERE user_id = ?
  `).get(userId).count;

  const avgAttempts = solvedCount > 0 ? Number((totalAttempts / solvedCount).toFixed(2)) : (totalAttempts > 0 ? totalAttempts : 0);

  return {
    ...user,
    stats: {
      solved_count: solvedCount,
      created_count: createdCount,
      total_attempts: totalAttempts,
      avg_attempts: avgAttempts
    }
  };
}

module.exports = {
  getGlobalLeaderboard,
  getUserStats
};
