const leaderboardService = require('../services/leaderboardService');

function getLeaderboard(req, res, next) {
  try {
    const leaderboard = leaderboardService.getGlobalLeaderboard();
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeaderboard
};
