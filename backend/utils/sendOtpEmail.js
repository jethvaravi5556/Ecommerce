import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
});

const sendOtpEmail = async (to, otp) => {
  const html = `
  <div style="background:#f4f6fb;padding:25px;font-family:Arial">

    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;
                box-shadow:0 10px 25px rgba(0,0,0,0.08)">

      <div style="background:linear-gradient(135deg,#667eea,#764ba2);
                  color:white;padding:30px;text-align:center">
        <h2 style="margin:0">Verify Your Account</h2>
        <p style="margin:5px 0 0 0;font-size:14px;opacity:0.9">
          Secure OTP Verification
        </p>
      </div>

      <div style="padding:35px;text-align:center">

        <p style="font-size:16px;color:#444">
          Use the OTP below to continue your login / signup process.
        </p>

        <div style="
            font-size:32px;
            letter-spacing:8px;
            font-weight:bold;
            background:#f2f4ff;
            display:inline-block;
            padding:18px 30px;
            border-radius:10px;
            margin:20px 0;
            color:#333;
        ">
          ${otp}
        </div>

        <p style="color:#888;font-size:14px">
          This OTP is valid for <b>1 minutes</b>.
        </p>

        <p style="color:#888;font-size:13px;margin-top:20px">
          If you did not request this, please ignore this email.
        </p>
      </div>

      <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#666">
        © 2026 YourStore. All Rights Reserved.
      </div>

    </div>

  </div>
  `;

  await transporter.sendMail({
    from: `"YourStore Security" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Your OTP Code",
    html,
  });
};

export default sendOtpEmail;
