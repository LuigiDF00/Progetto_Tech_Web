import { Request, Response, NextFunction } from 'express';
import leaderboardService from '../services/leaderboardService';

export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const leaderboard = await leaderboardService.getGlobalLeaderboard();
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

export default {
  getLeaderboard
};
