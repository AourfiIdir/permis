import express from 'express';
import {getProgress,getProgressById,createProgress,updateProgress,deleteProgress  } from '../services/progressService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/").get(getProgress);
router.route("/:id").get(getProgressById);
router.route("/").post(createProgress);
router.route("/:id").put(updateProgress);
router.route("/:id").delete(deleteProgress);

export default router;
