import express from 'express';
import { setComplete,setUncomplete,getUserCards } from '../services/userToCard.js';
import authenticateToken from '../middleware/authenticateToken.js';


const router = express.Router();
router.use(authenticateToken);

router.route("/").get(getUserCards);
router.route("/complete").post(setComplete);//require userId and cardId in body 
router.route("/uncomplete").post(setUncomplete);//require userId and cardId in body

export default router;