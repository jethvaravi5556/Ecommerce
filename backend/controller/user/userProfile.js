import userModel from "../../models/userModel.js";

async function userProfileController(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findById(req.userId).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    res.json({
      message: "User Profile",
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
}

export default userProfileController;
