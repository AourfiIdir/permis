import express from "express"

import {signinCheck} from "./services/signin"

const router = express.Router();

router.
    route("/signin").
    post(signinCheck);

export default router;
