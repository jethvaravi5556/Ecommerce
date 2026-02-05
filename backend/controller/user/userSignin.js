import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function userSigninController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    if (!process.env.TOKEN_SECRET_KEY) {
      return res.status(500).json({
        message: "Server error: Missing secret key",
        error: true,
        success: false,
      });
    }

    const tokenData = { _id: user._id, email: user.email };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // use Lax for dev
    };

    return res
  .cookie("token", token, cookieOptions)
  .status(200)
  .json({
    message: "Login successful",
    success: true,
    error: false,
    token, // ✅ send token separately if you want
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || "",
    },
  });


  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export default userSigninController;
