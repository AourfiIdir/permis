import nodemailer from "nodemailer";
import dotenv from "dotenv";
const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP host/port
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"MyLicenceApp" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your verification code",
    text: `Your code is ${otp}. It expires in 10 minutes.`,
  });
}
