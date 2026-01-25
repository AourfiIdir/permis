import User from "../models/User.js"
import EmailOtp from "../models/EmailOtp.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOtpEmail } from "../utilityFuncs/emailSender.js";

export async function requestOtp(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ ok: false, message: "Email is required" });
  }

  try {
    // 1️⃣ Remove old OTP if exists
    await EmailOtp.deleteOne({ email });

    // 2️⃣ Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3️⃣ Save OTP to DB
    await EmailOtp.create({ email, otpHash, expiresAt });

    // 4️⃣ Send OTP via email
    await sendOtpEmail(email, otp);

    // 5️⃣ Response (do NOT return OTP in production)
    res.json({ ok: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to send OTP" });
  }
}





export async function signin(req,res){
    const {nom,prenom,email,otp,password,sexe,wilaya,age,username} = req.body;
    //create an user
    const role="user";
    try{

        const record = await EmailOtp.findOne({ email });
        if (!record) return res.status(400).json({ ok: false, message: "Code not found" ,email:email});
        if (record.expiresAt < new Date()) return res.status(400).json({ ok: false, message: "Code expired" });

        const ok = await bcrypt.compare(otp, record.otpHash);
        if (!ok) return res.status(400).json({ ok: false, message: "Invalid code" });

        await EmailOtp.deleteOne({ email });



        const userCreated = await User.create({
        nom: nom,
        prenom:  prenom,
        email:email,
        password: password,
        sexe: sexe,
        wilaya: wilaya,
        age: age,
        role: role,
        username: username
    }
)
    res.status(200).json({
        message:"user created succussfully",
        user:userCreated
    })
    }catch(err){
        if(err.code===11000) return res.status(401).json({
            err:"duplicated email or username"
        });    
        else return res.status(401).json({
            message:"error in creating the user",
            err:err
        });  
        
    }
    
    
}

// Add this to your existing auth routes

// POST /auth/resend-otp
export async function resendOtp(req, res) {
  const { email } = req.body;
  try {
    // Validate email exists in EmailOtp collection
    const record = await EmailOtp.findOne({ email });
    if (!record) return res.status(400).json({ ok: false, message: "Email not found" });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update the OTP record
    await EmailOtp.findOneAndUpdate(
      { email },
      { otpHash, expiresAt },
      { new: true }
    );

    // Send new OTP to email
    await sendOtpEmail(email, otp);
    res.json({ ok: true, message: "New OTP sent" });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to resend OTP" });
  }
}