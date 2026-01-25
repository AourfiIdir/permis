import mongoose from "mongoose";

const EmailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("EmailOtp", EmailOtpSchema);