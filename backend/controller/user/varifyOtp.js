import otpModel from "../../models/otpModel.js";

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await otpModel.findOne({ email });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    res.json({ message: "OTP verified", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export default verifyOtpController;
