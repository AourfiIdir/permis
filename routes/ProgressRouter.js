import express from 'express';
import {getProgress,getProgressById,createProgress,updateProgress,deleteProgress,getProgressByUserId  } from '../services/progressService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/").get(getProgress);


router.route("/user").get(getProgressByUserId);
router.route("/").post(createProgress);
router.route("/:id").put(updateProgress);
router.route("/:id").delete(deleteProgress);
router.route("/:id").get(getProgressById);
export default router;
