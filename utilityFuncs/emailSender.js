import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: "FlashFlash <onboarding@resend.dev>", // ✅ works without domain verification
      to: to,
      subject: "Your verification code",
      text: `Your code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>FlashFlash Verification Code</h2>
          <p>Your code is:</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
}