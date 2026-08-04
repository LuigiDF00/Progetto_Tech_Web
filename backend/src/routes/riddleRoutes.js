const express = require('express');
const router = express.Router();
const riddleController = require('../controllers/riddleController');
const { authenticateToken, optionalAuthenticateToken } = require('../middlewares/authMiddleware');

router.get('/', optionalAuthenticateToken, riddleController.getAllRiddles);
router.get('/:id', optionalAuthenticateToken, riddleController.getRiddleById);
router.post('/', authenticateToken, riddleController.createRiddle);
router.post('/:id/attempt', authenticateToken, riddleController.submitAttempt);

module.exports = router;
