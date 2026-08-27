import {Router} from 'express'
import { deletePlan, generateStudyPlan, getAllStudyPlans, updateStudySchema } from '../controller/studyController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get("/",verifyUser,getAllStudyPlans);
router.post("/", verifyUser, generateStudyPlan)
router.put("/:id", verifyUser, updateStudySchema)
router.delete("/:id", verifyUser, deletePlan)

export default router
