import express from 'express'
import { getCurrentQuestion, getReport, startInterview, submitCode } from '../controllers/interviewController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/start",protect,startInterview);
router.get("/report/:id", protect, getReport);
router.get("/:id/question",protect,getCurrentQuestion);
router.post("/:id/submit",protect,submitCode);
export default router;