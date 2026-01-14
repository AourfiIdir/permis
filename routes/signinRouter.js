import express from "express"

import signin from "../services/signinService.js"

const router = express.Router();

router.
    route("/").
    post(signin);

export default router;
