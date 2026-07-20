import express from "express"
import loginCheck, { refresh, logout } from "../services/loginService.js"
import { googleSignin } from "../services/signinService.js"

const router = express.Router()

router.route("/").post(loginCheck)
router.route("/google").post(googleSignin)
router.route("/refresh").post(refresh)
router.route("/logout").post(logout)

export default router
