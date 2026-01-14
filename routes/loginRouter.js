import express from "express"
import loginCheck from "../services/loginService.js"

const router = express.Router();

router.
    route("/").
    get(loginCheck);

export default router;






