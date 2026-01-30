import express from 'express';
import { getCardStatus,updateCardStatus,setComplete,getUserCards,createUserCard } from '../services/userToCard.js';
import authenticateToken from '../middleware/authenticateToken.js';


const router = express.Router();
router.use(authenticateToken);

//get the cards of a user by category
router.route("/user/:categoryName").get(getUserCards);

router.route("/status").put(updateCardStatus);//require userId, cardId and status in body
router.route("/complete").post(setComplete);//require userId and cardId in body 
router.route("/status/:cardId").get(getCardStatus);

router.route("/").post(createUserCard);


export default router;