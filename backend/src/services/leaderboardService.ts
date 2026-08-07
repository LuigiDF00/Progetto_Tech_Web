import { User, Riddle, Attempt } from '../models';

export interface LeaderboardUserEntry {
  user_id: number;
  username: string;
  avatar_url: string | null;
  solved_count: number;
  riddles_solved: number;
  created_count: number;
  riddles_created: number;
  avg_attempts: number;
}

export interface UserStatsResult {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: Date;
  riddles_solved: number;
  riddles_created: number;
  solved_count: number;
  created_count: number;
  total_attempts: number;
  avg_attempts: number;
  stats: {
    solved_count: number;
    created_count: number;
    total_attempts: number;
    avg_attempts: number;
    riddles_solved: number;
    riddles_created: number;
  };
}

/**
 * Calcola e restituisce la classifica globale degli utenti tramite Modelli TypeScript.
 */
export async function getGlobalLeaderboard(): Promise<LeaderboardUserEntry[]> {
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

  const leaderboard: LeaderboardUserEntry[] = users.map(user => {
    const attempts = user.attempts || [];
    const riddles = user.riddles || [];
    const solvedAttempts = attempts.filter(a => a.is_solved === 1);
    
    const uniqueSolvedRiddleIds = new Set(solvedAttempts.map(a => a.riddle_id));
    const solvedCount = uniqueSolvedRiddleIds.size;
    const createdCount = riddles.length;

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
 * Restituisce le statistiche dettagliate di un singolo utente tramite Modelli TypeScript
 */
export async function getUserStats(userId: number | string): Promise<UserStatsResult | null> {
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
  delete (userJson as any).riddles;
  delete (userJson as any).attempts;

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

export default {
  getGlobalLeaderboard,
  getUserStats
};
