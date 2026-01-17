import { getUserById,getUsers } from "../services/userService.js";
import express from "express"
import authenticateToken from "../middleware/authenticateToken.js"
import checkRoles from "../middleware/authenticateRole.js"
import role from "../roles.js"
const router = express.Router();
router.use(authenticateToken);

router.
    route("/").
    get(getUsers);
router.
    route("/:id").
    get(checkRoles([role.ADMIN,role.USER]),getUserById);
    
export default router;