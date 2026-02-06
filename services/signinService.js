import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOtpEmail } from "../utilityFuncs/emailSender.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======== OTP Request ========
export async function requestOtp(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ ok: false, message: "Email is required" });
    }

    // Block OTP for Google accounts
    const user = await User.findOne({ email });
    if (user && user.provider === "google") {
      return res.status(400).json({
        ok: false,
        message: "Use Google sign-in for this email",
      });
    }

    // Remove old OTP
    await EmailOtp.deleteOne({ email });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await EmailOtp.create({ email, otpHash, expiresAt });

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Failed to send OTP" });
  }
}

// ======== OTP Sign-Up / Sign-In ========
export async function signin(req, res) {
  const { nom, prenom, email, otp, password, sexe, wilaya, age, username } =
    req.body;

  try {
    const record = await EmailOtp.findOne({ email });
    if (!record)
      return res.status(400).json({ ok: false, message: "Code not found" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ ok: false, message: "Code expired" });

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid)
      return res.status(400).json({ ok: false, message: "Invalid code" });

    await EmailOtp.deleteOne({ email });

    const user = await User.create({
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

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      ok: true,
      message: "User created successfully",
      user,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "Duplicated email or username",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Error creating user",
    });
  }
}

// ======== Resend OTP ========
export async function resendOtp(req, res) {
  const { email } = req.body;

  try {
    const record = await EmailOtp.findOne({ email });
    if (!record)
      return res.status(400).json({ ok: false, message: "Email not found" });

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

// ======== Google Sign-In ========
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
    const { sub: googleId, email, given_name, family_name, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ ok: false, message: "Email not verified" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // ===== SIGNUP =====
    if (isSignup) {
      if (user) {
        return res.status(400).json({
          ok: false,
          message: user.provider === "local"
            ? "This email is registered with password. Use that to login."
            : "This Google account is already used. Please login instead.",
        });
      }

      // Create new Google user
      user = await User.create({
        email,
        googleId,
        prenom: given_name,
        nom: family_name,
        provider: "google",
        role: "user",
        username: email.split("@")[0],
      });

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
      return res.status(201).json({ ok: true, message: "Google sign-up successful", user, token });
    }

    // ===== LOGIN =====
    else {
      // Case 1: No user with this email
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "No account found with this Google account. Please sign up first.",
        });
      }

      // Case 2: User exists but not Google
      if (user.provider !== "google") {
        return res.status(400).json({
          ok: false,
          message: "This email is registered with password. Please use that to login.",
        });
      }

      // Case 3: Google account mismatch (someone trying to use a different Google account)
      if (user.googleId !== googleId) {
        return res.status(401).json({
          ok: false,
          message: "This Google account is not linked to this user.",
        });
      }

      // SUCCESS: correct Google account for login
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
      return res.status(200).json({ ok: true, message: "Google login successful", user, token });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ ok: false, message: "Invalid Google token" });
  }
}
