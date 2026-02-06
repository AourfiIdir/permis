import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOtpEmail } from "../utilityFuncs/emailSender.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

// ======== Helper: Generate Tokens ========
function generateTokens(userId, role) {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  
  const refreshToken = jwt.sign(
    { userId, role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
  
  return { token, refreshToken };
}

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

    // Generate tokens
    const { token, refreshToken } = generateTokens(user._id, user.role);

    return res.status(201).json({
      ok: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        email: user.email,
        provider: user.provider,
        role: user.role,
        sexe: user.sexe,
        wilaya: user.wilaya,
        age: user.age,
      },
      token,
      refreshToken,
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
  const { idToken } = req.body;

  try {
    if (!idToken) {
      console.error("❌ No idToken provided");
      return res.status(400).json({ ok: false, message: "Google token missing" });
    }

    console.log("🔵 Verifying Google ID token...");

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, email_verified } = payload;

    console.log("🔵 Google token verified:", { email, googleId, verified: email_verified });

    if (!email_verified) {
      console.error("❌ Email not verified by Google");
      return res.status(401).json({ ok: false, message: "Email not verified by Google" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist: create automatically
    if (!user) {
      console.log("🔵 Creating new Google user...");
      
      user = await User.create({
        email,
        googleId,
        prenom: given_name || "",
        nom: family_name || "",
        provider: "google",
        role: "user",
        username: email.split("@")[0] + "_" + Math.random().toString(36).substr(2, 5),
      });
      
      console.log("✅ New Google user created:", user._id);
    } else {
      console.log("🔵 Existing user found:", user._id);
      
      // If user exists but is local: block Google login
      if (user.provider !== "google") {
        console.error("❌ Email registered with password, not Google");
        return res.status(400).json({
          ok: false,
          message: "This email is registered with password. Use normal login.",
        });
      }

      // If Google ID mismatch: block login
      if (user.googleId !== googleId) {
        console.error("❌ Google ID mismatch");
        return res.status(401).json({
          ok: false,
          message: "This Google account is not linked to this user.",
        });
      }
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user._id, user.role);

    console.log("✅ Google login successful for user:", user._id);

    return res.status(200).json({
      ok: true,
      message: "Google login/signup successful",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        email: user.email,
        provider: user.provider,
        role: user.role,
        sexe: user.sexe,
        wilaya: user.wilaya,
        age: user.age,
      },
      token,
      refreshToken,
    });

  } catch (err) {
    console.error("❌ Google signin error:", err);
    return res.status(401).json({ 
      ok: false, 
      message: "Invalid Google token",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}