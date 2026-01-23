import express from "express"

import {signin,requestOtp,resendOtp} from "../services/signinService.js"

const router = express.Router();

router.
    route("/").
    post(signin);
router.route("/request-otp").post(requestOtp);
router.route("/resend-otp").post(resendOtp);

export default router;
