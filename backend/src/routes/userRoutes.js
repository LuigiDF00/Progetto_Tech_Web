const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile', authenticateToken, userController.getProfile);
router.get('/:id/stats', userController.getProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;
