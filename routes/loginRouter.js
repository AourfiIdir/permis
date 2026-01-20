import express from "express"
import loginCheck from "../services/loginService.js"
import {refresh} from "../services/loginService.js"

const router = express.Router();

router.
    route("/").
    get(loginCheck);

router.
    route("/refresh").
    post(refresh);


export default router;






