import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"MyLicenceApp" <no-reply@mylicenceapp.com>`,
    to,
    subject: "Your verification code",
    text: `Your code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
}
