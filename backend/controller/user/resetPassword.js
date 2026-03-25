import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import otpModel from "../../models/otpModel.js";

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await otpModel.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }
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

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await otpModel.deleteOne({ email });

    res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export default resetPasswordController;
