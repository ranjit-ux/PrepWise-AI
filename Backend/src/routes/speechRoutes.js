import express from 'express'
import { saveSpeech } from '../controllers/interviewController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/:id",protect,saveSpeech);

export default router;