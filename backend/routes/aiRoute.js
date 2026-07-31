import { Router } from 'express';
import { verifyUser } from '../middleware/authMiddleware.js';
import { analyzeStudyMentorController } from '../controller/aiController.js';

const router = Router();

router.post('/analyze', verifyUser, analyzeStudyMentorController);

export default router;
