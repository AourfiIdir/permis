import express from 'express';
import { getCardsfromList,deletecardfromList,addcardtoList } from '../services/listToCardService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/:listId/cards").get(getCardsfromList);
router.route("/").post(addcardtoList);
router.route("/").delete(deletecardfromList);

export default router;





