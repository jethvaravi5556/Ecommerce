import mongoose from "mongoose";
import userModel from "../../models/userModel.js";

async function deleteUserController(req, res) {
  try {
    console.log("Session User ID:", req.userId);

    //Check authentication
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        error: true,
        success: false,
      });
    }

    const userId = req.params.id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid User ID",
        error: true,
        success: false,
      });
    }

    // Check admin role
    const sessionUser = await userModel.findById(req.userId).select("role");

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        error: true,
        success: false,
      });
    }

    // Prevent admin deleting himself
    if (req.userId.toString() === userId) {
      return res.status(400).json({
        message: "Admin cannot delete own account",
        error: true,
        success: false,
      });
    }

    //  Delete user
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default deleteUserController;
