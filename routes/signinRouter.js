import express from "express";
import {
  signin,
  requestOtp,
  resendOtp,
  googleSignin,
} from "../services/signinService.js";

const router = express.Router();

router.post("/", signin);
router.post("/request-otp", requestOtp);
router.post("/resend-otp", resendOtp);
router.post("/google", googleSignin);

export default router;
