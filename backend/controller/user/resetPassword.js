import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import otpModel from "../../models/otpModel.js";

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record after successful reset
    await otpModel.deleteOne({ email });

    res.json({ message: "Password reset successful", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

export default resetPasswordController;
