import express from "express"

import {loginCheck} from "./services/login"

const router = express.Router();

router.
    route("/login").
    get(loginCheck);






