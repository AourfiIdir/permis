import express from 'express';
import authentificateToken from "../middleware/authenticateToken.js"
import {getCards,getCard,createCard,getByCetag} from "../services/cardService.js"
const router = express.Router();

router.
    route("/").
    get(authentificateToken,getCards);


router.
    route("/:id").
    get(getCard);




router.
    route('/category').
    get(getByCetag);

router.
    route('/').
    post(createCard);
    

export default router;
