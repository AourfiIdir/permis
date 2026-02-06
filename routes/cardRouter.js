import express from 'express';
import role from "../roles.js"
import checkRoles from "../middleware/authenticateRole.js"
import authentificateToken from "../middleware/authenticateToken.js"
import {getCards,getCard,createCard,getByCategory,getCategories} from "../services/cardService.js"

const router = express.Router();
router.use(authentificateToken);
router.
    route("/").
    get(checkRoles([role.USER,role.ADMIN]),getCards);

router.route("/categories").get(checkRoles([role.USER,role.ADMIN]),getCategories);

router.
    route("/:id").
    get(checkRoles([role.USER,role.ADMIN]),getCard);



router.
    route('/category/:categoryName').
    get(checkRoles([role.USER,role.ADMIN]),getByCategory);

router.
    route('/').
    post(checkRoles([role.ADMIN]),createCard);



export default router;
