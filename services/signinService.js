import User from "../models/User.js"
import EmailOtp from "../models/EmailOtp.js"
import Card from "../models/Card.js"
import UserToCard from "../models/UserToCard.js"
import createToken from "../utilityFuncs/createToken.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { sendOtpEmail } from "../utilityFuncs/emailSender.js"
import { OAuth2Client } from "google-auth-library"

dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID)

export async function requestOtp(req, res) {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (user && user.provider === "google") {
      return res.status(400).json({ success: false, message: "Use Google sign-in for this email" })
    }

    await EmailOtp.deleteOne({ email })

    const otp = crypto.randomInt(100000, 999999).toString()
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await EmailOtp.create({ email, otpHash, expiresAt })
    await sendOtpEmail(email, otp)

    return res.status(200).json({ success: true, message: "OTP sent successfully" })
  } catch (err) {
    console.error("Request OTP error:", err)
    return res.status(500).json({ success: false, message: "Failed to send OTP" })
  }
}

export async function signin(req, res) {
  try {
    const { nom, prenom, email, otp, password, sexe, wilaya, age, username } = req.body

    const record = await EmailOtp.findOne({ email })
    if (!record) {
      return res.status(400).json({ success: false, message: "Code not found" })
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Code expired" })
    }

    const isValidOtp = await bcrypt.compare(otp, record.otpHash)
    if (!isValidOtp) {
      return res.status(400).json({ success: false, message: "Invalid code" })
    }

    await EmailOtp.deleteOne({ email })

    let user = await User.findOne({ email })

    if (user) {
      const payload = { id: user._id, role: user.role }
      const token = createToken(payload, "7d")

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { _id: user._id, nom: user.nom, prenom: user.prenom, username: user.username },
        token,
      })
    }

    user = await User.create({
      nom, prenom, email, password, sexe, wilaya, age, username,
      role: "user",
      provider: "local",
    })

    const cards = await Card.find({}).select("_id")
    if (cards.length > 0) {
      await UserToCard.insertMany(
        cards.map(card => ({
          cardId: card._id,
          userId: user._id,
          status: "uncomplete",
          hit: 0,
        }))
      )
    }

    const payload = { id: user._id, role: user.role }
    const token = createToken(payload, "7d")

    return res.status(201).json({
      success: true,
      message: "User created and logged in successfully",
      user: { _id: user._id, nom: user.nom, prenom: user.prenom, username: user.username },
      token,
    })
  } catch (err) {
    console.error("Signin error:", err)
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Email or username already exists" })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body
    const record = await EmailOtp.findOne({ email })
    if (!record) {
      return res.status(400).json({ success: false, message: "No pending OTP for this email" })
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await EmailOtp.findOneAndUpdate({ email }, { otpHash, expiresAt }, { new: true })
    await sendOtpEmail(email, otp)

    return res.status(200).json({ success: true, message: "New OTP sent" })
  } catch (err) {
    console.error("Resend OTP error:", err)
    return res.status(500).json({ success: false, message: "Failed to resend OTP" })
  }
}

export async function googleSignin(req, res) {
  try {
    const { idToken, isSignup } = req.body

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Google token missing" })
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, given_name, family_name, email_verified } = payload

    if (!email_verified) {
      return res.status(401).json({ success: false, message: "Email not verified" })
    }

    let user = await User.findOne({ email })

    if (isSignup) {
      if (user) {
        return res.status(400).json({
          success: false,
          message: user.provider === "local"
            ? "This email is registered with password"
            : "Google account already exists. Please login.",
        })
      }

      user = await User.create({
        email, googleId,
        prenom: given_name, nom: family_name,
        provider: "google", role: "user",
        username: email.split("@")[0],
      })

      const tokenPayload = { id: user._id, role: user.role }
      const token = createToken(tokenPayload, "7d")
      const refreshToken = createToken(tokenPayload, "7d")

      return res.status(201).json({
        success: true,
        message: "Google sign-up successful",
        user: { _id: user._id, nom: user.nom, prenom: user.prenom, username: user.username },
        token,
        refreshToken,
      })
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found. Please sign up." })
    }

    if (user.provider !== "google") {
      return res.status(400).json({ success: false, message: "Use email & password to login" })
    }

    if (user.googleId !== googleId) {
      return res.status(401).json({ success: false, message: "Google account mismatch" })
    }

    const tokenPayload = { id: user._id, role: user.role }
    const token = createToken(tokenPayload, "7d")
    const refreshToken = createToken(tokenPayload, "7d")

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: { _id: user._id, nom: user.nom, prenom: user.prenom, username: user.username },
      token,
      refreshToken,
    })
  } catch (err) {
    console.error("Google signin error:", err)
    return res.status(401).json({ success: false, message: "Invalid Google token" })
  }
}
