import { Router } from 'express';
import { getProfile, uploadAvatar } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import uploadAvatarMiddleware from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/profile/:id', getProfile);
router.post('/avatar', authenticateToken, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

export default router;
