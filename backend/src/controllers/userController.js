const { User } = require('../models');
const leaderboardService = require('../services/leaderboardService');

async function getProfile(req, res, next) {
  try {
    const userId = req.params.id || req.user.id;
    const stats = await leaderboardService.getUserStats(userId);

    if (!stats) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    res.json({ user: stats });
  } catch (err) {
    next(err);
  }
}

async function uploadAvatar(req, res, next) {
  try {
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

module.exports = {
  getProfile,
  uploadAvatar
};
