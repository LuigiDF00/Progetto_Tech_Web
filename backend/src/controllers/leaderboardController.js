const leaderboardService = require('../services/leaderboardService');

async function getLeaderboard(req, res, next) {
  try {
    const leaderboard = await leaderboardService.getGlobalLeaderboard();
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeaderboard
};
