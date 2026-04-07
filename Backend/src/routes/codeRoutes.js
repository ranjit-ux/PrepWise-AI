import express from 'express'
import { runCodeController } from '../controllers/codeController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/run",protect,runCodeController);

export default router;