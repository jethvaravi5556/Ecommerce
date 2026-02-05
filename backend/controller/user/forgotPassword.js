import userModel from "../../models/userModel.js";
import sendEmail from "../../utils/sendOtpEmail.js";
import otpModel from "../../models/otpModel.js";
import generateOtp from "../../utils/generateOtp.js";

const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const otp = generateOtp();

    await otpModel.findOneAndUpdate(
      { email },
      { email, otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const html = `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`;
    await sendEmail(email, "Password Reset OTP", html);

    res.json({ message: "OTP sent to email", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export default sendOtpController;
