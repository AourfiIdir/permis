import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import Card from "../models/Card.js";
import UserToCard from "../models/UserToCard.js";
import createToken from "../utilityFuncs/createToken.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { sendOtpEmail } from "../utilityFuncs/emailSender.js";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

//
// ======================= REQUEST OTP =======================
//
export async function requestOtp(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ ok: false, message: "Email is required" });
    }

    // Block OTP for Google users
    const user = await User.findOne({ email });
    if (user && user.provider === "google") {
      return res.status(400).json({
        ok: false,
        message: "Use Google sign-in for this email",
      });
    }

    // Remove old OTP
    await EmailOtp.deleteOne({ email });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await EmailOtp.create({ email, otpHash, expiresAt });

    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Failed to send OTP" });
  }
}

//
// ======================= OTP SIGNIN / SIGNUP =======================
//
export async function signin(req, res) {
  const { nom, prenom, email, otp, password, sexe, wilaya, age, username } =
    req.body;

  try {
    // 1. Check OTP
    const record = await EmailOtp.findOne({ email });
    if (!record) {
      return res.status(400).json({ ok: false, message: "Code not found" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ ok: false, message: "Code expired" });
    }

    const isValidOtp = await bcrypt.compare(otp, record.otpHash);
    if (!isValidOtp) {
      return res.status(400).json({ ok: false, message: "Invalid code" });
    }

    // OTP is single-use
    await EmailOtp.deleteOne({ email });

    // 2. Check if user exists
    let user = await User.findOne({ email });

    // ================= LOGIN =================
    if (user) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        ok: true,
        message: "Login successful",
        user: user.nom,
        token,
      });
    }

    // ================= SIGNUP =================
    user = await User.create({
      nom,
      prenom,
      email,
      password,
      sexe,
      wilaya,
      age,
      username,
      role: "user",
      provider: "local",
    });

    // Assign cards to user
    const cards = await Card.find({});
    if(cards.length == 0){
      console.log("no cards retireved");
    }
    const assignResult = await Promise.all(
      cards.map((card) =>
        UserToCard.create({
          cardId: card._id,
          userId: user._id,
          status: "uncomplete",
          hit: 0,
        })
      )
    );
    if(!assignResult || assignResult.length == 0){
        console.log("no cards assigned");
    }

    const payload = {
                id: user._id,
                role: user.role
            };
    const token = createToken(payload);

    return res.status(201).json({
      ok: true,
      message: "User created and logged in successfully",
      user: user.nom,
      token
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "Email or username already exists",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}

//
// ======================= RESEND OTP =======================
//
export async function resendOtp(req, res) {
  const { email } = req.body;

  try {
    const record = await EmailOtp.findOne({ email });
    if (!record) {
      return res.status(400).json({ ok: false, message: "Email not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailOtp.findOneAndUpdate(
      { email },
      { otpHash, expiresAt },
      { new: true }
    );

    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "New OTP sent" });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Failed to resend OTP",
    });
  }
}

//
// ======================= GOOGLE SIGNIN =======================
//
export async function googleSignin(req, res) {
  const { idToken, isSignup } = req.body;

  try {
    if (!idToken) {
      return res.status(400).json({ ok: false, message: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      given_name,
      family_name,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(401).json({ ok: false, message: "Email not verified" });
    }

    let user = await User.findOne({ email });

    // ================= SIGNUP =================
    if (isSignup) {
      if (user) {
        return res.status(400).json({
          ok: false,
          message:
            user.provider === "local"
              ? "This email is registered with password"
              : "Google account already exists. Please login.",
        });
      }

      user = await User.create({
        email,
        googleId,
        prenom: given_name,
        nom: family_name,
        provider: "google",
        role: "user",
        username: email.split("@")[0],
      });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        ok: true,
        message: "Google sign-up successful",
        user,
        token,
      });
    }

    // ================= LOGIN =================
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "No account found. Please sign up.",
      });
    }

    if (user.provider !== "google") {
      return res.status(400).json({
        ok: false,
        message: "Use email & password to login",
      });
    }

    if (user.googleId !== googleId) {
      return res.status(401).json({
        ok: false,
        message: "Google account mismatch",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      ok: true,
      message: "Google login successful",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ ok: false, message: "Invalid Google token" });
  }
}