import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import leaderboardService from '../services/leaderboardService';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    const userId = req.params.id || (req.user ? req.user.id : null);
    if (!userId) {
      return res.status(400).json({ error: 'ID Utente non specificato.' });
    }

    const stats = await leaderboardService.getUserStats(userId);

    if (!stats) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    res.json({ user: stats });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utente non autenticato.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato.' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await User.update(
      { avatar_url: avatarUrl },
      { where: { id: req.user.id } }
    );

    res.json({
      message: 'Avatar aggiornato con successo.',
      avatar_url: avatarUrl
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getProfile,
  uploadAvatar
};
