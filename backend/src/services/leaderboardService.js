const { User, Riddle, Attempt } = require('../models');

/**
 * Calcola e restituisce la classifica globale degli utenti tramite Sequelize Models.
 * Ordinata per:
 * 1. Numero di enigmi unici risolti (DESC)
 * 2. Minor numero medio di tentativi impiegati per enigma (ASC)
 * 3. Username (ASC)
 */
async function getGlobalLeaderboard() {
  const users = await User.findAll({
    include: [
      {
        model: Riddle,
        as: 'riddles',
        attributes: ['id']
      },
      {
        model: Attempt,
        as: 'attempts',
        attributes: ['id', 'riddle_id', 'is_solved']
      }
    ]
  });

  const leaderboard = users.map(user => {
    const attempts = user.attempts || [];
    const riddles = user.riddles || [];
    const solvedAttempts = attempts.filter(a => a.is_solved === 1);
    
    // Set degli ID degli enigmi unici risolti
    const uniqueSolvedRiddleIds = new Set(solvedAttempts.map(a => a.riddle_id));
    const solvedCount = uniqueSolvedRiddleIds.size;
    const createdCount = riddles.length;

    // Calcolo tentativi medi
    let avgAttempts = 0;
    if (uniqueSolvedRiddleIds.size > 0) {
      avgAttempts = Number((attempts.length / uniqueSolvedRiddleIds.size).toFixed(2));
    } else if (attempts.length > 0) {
      avgAttempts = attempts.length;
    }

    return {
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      solved_count: solvedCount,
      riddles_solved: solvedCount,
      created_count: createdCount,
      riddles_created: createdCount,
      avg_attempts: avgAttempts
    };
  });

  // Ordinamento
  leaderboard.sort((a, b) => {
    if (b.solved_count !== a.solved_count) {
      return b.solved_count - a.solved_count;
    }
    if (a.avg_attempts !== b.avg_attempts) {
      return a.avg_attempts - b.avg_attempts;
    }
    return a.username.localeCompare(b.username);
  });

  return leaderboard;
}

/**
 * Restituisce le statistiche dettagliate di un singolo utente tramite Sequelize Models
 */
async function getUserStats(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'avatar_url', 'created_at'],
    include: [
      {
        model: Riddle,
        as: 'riddles',
        attributes: ['id']
      },
      {
        model: Attempt,
        as: 'attempts',
        attributes: ['id', 'riddle_id', 'is_solved']
      }
    ]
  });

  if (!user) return null;

  const attempts = user.attempts || [];
  const riddles = user.riddles || [];
  const solvedAttempts = attempts.filter(a => a.is_solved === 1);

  const uniqueSolvedRiddleIds = new Set(solvedAttempts.map(a => a.riddle_id));
  const solvedCount = uniqueSolvedRiddleIds.size;
  const createdCount = riddles.length;
  const totalAttempts = attempts.length;

  const avgAttempts = solvedCount > 0 
    ? Number((totalAttempts / solvedCount).toFixed(2)) 
    : (totalAttempts > 0 ? totalAttempts : 0);

  const userJson = user.toJSON();
  delete userJson.riddles;
  delete userJson.attempts;

  return {
    ...userJson,
    riddles_solved: solvedCount,
    riddles_created: createdCount,
    solved_count: solvedCount,
    created_count: createdCount,
    total_attempts: totalAttempts,
    avg_attempts: avgAttempts,
    stats: {
      solved_count: solvedCount,
      created_count: createdCount,
      total_attempts: totalAttempts,
      avg_attempts: avgAttempts,
      riddles_solved: solvedCount,
      riddles_created: createdCount
    }
  };
}

module.exports = {
  getGlobalLeaderboard,
  getUserStats
};
