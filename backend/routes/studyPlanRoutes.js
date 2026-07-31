import {Router} from 'express'
import { generateStudyPlan, getAllStudyPlans } from '../controller/studyController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get("/",verifyUser,getAllStudyPlans);
router.post("/", verifyUser, generateStudyPlan)

export default router
