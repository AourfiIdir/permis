import { getUserById, getUsers} from "../services/userService.js";
import express from "express"
import authenticateToken from "../middleware/authenticateToken.js"

const router = express.Router();
router.use(authenticateToken);
router.
    route("/").
    get(getUsers);


router.
    route("/currentUser").
    get(getUserById);
    

export default router;