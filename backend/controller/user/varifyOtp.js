import otpModel from "../../models/otpModel.js";

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await otpModel.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    // ⭐ manual expiry check (1 minute)
    const diff = Date.now() - new Date(record.createdAt).getTime();

    if (diff > 60 * 1000) {
      await otpModel.deleteOne({ email });

      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    res.json({
      message: "OTP verified",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export default verifyOtpController;
