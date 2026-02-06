import express from "express";
import { createMistake,getMistakes,getMistakeById,updateMistake,deleteMistake, getMistakeByUserId } from "../services/mistakeService.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();
router.use(authenticateToken);

router.route("/").post(createMistake);

router.route("/").get(getMistakes);

router.route("/:id").get(getMistakeById);
router.route("/myMistakes/:userId").get(getMistakeByUserId);

router.route("/:id").put(updateMistake);

router.route("/:id").delete(deleteMistake);

export default router;
