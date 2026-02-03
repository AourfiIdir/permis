import {createCard,assignCards} from "../services/adminService.js"
import authentificateToken from "../../middleware/authenticateToken.js"
import checkRoles from "../../middleware/authenticateRole.js"
import express from "express"
import role from "../../roles.js"
const router = express.Router();

router.use(authentificateToken);
router.use(checkRoles([role.ADMIN]));
//create a new card and assign it to all users
router.route("/").post(createCard);

//assign all cards to a certain user
router.route("/assignCards").post(assignCards)


export default router;