import express from "express"
import loginCheck from "../services/loginService.js"
import {refresh} from "../services/loginService.js"
import {logout} from "../services/loginService.js"
const router = express.Router();

router.
    route("/").
    post(loginCheck);

router.
    route("/refresh").
    post(refresh);

router.
    route("/logout").
    post(logout);

export default router;






