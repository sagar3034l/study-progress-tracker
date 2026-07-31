import {Router} from 'express'
import { createProgressController, getDataForStudyChart, getSubjectLogs } from '../controller/studyProgressController.js';
import {verifyUser} from '../middleware/authMiddleware.js'

const router = Router();

router.get("/logs",verifyUser,getSubjectLogs)
router.post("/:id",verifyUser,createProgressController)
router.get("/chart-data",verifyUser,getDataForStudyChart)

export default router;