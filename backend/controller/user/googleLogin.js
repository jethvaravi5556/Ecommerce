import { OAuth2Client } from "google-auth-library";
import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // ✅ Important for fallback password

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      // ✅ Provide a dummy password to satisfy mongoose validation
      const dummyPassword = crypto.randomUUID();

      user = await userModel.create({
        name,
        email,
        password: dummyPassword,
        profilePic: picture,
        role: "GENERAL",
        isVerified: true,
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
  expiresIn: "7d",
});

// ✅ Must use jwtToken here
res.cookie("token", jwtToken, {
  httpOnly: true,
  sameSite: "Lax", // or 'None' if you're using cross-site
  secure: false // true in production with HTTPS
});

res.json({
  message: "Google login successful",
  success: true,
  token: jwtToken,
});

  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Google login failed",
      error: err.message,
    });
  }
};
