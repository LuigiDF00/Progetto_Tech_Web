import { Router } from 'express';
import { createRiddle, getAllRiddles, getRiddleById, submitAttempt } from '../controllers/riddleController';
import { authenticateToken, optionalAuthenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuthenticateToken, getAllRiddles);
router.get('/:id', optionalAuthenticateToken, getRiddleById);
router.post('/', authenticateToken, createRiddle);
router.post('/:id/attempt', authenticateToken, submitAttempt);

export default router;
