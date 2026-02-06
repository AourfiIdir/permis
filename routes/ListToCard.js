import express from 'express';
import { getCardsfromList,deletecardfromList,addcardtoList } from '../services/listToCardService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/:listId/cards").get(getCardsfromList);
router.route("/:listId/:cardId").post(addcardtoList);
router.route("/:listId/:cardId").delete(deletecardfromList);

export default router;





