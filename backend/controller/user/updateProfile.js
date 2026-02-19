import userModel from "../../models/userModel.js";

async function updateProfileController(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    const { name, email } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,

        {
          name,
          email,
        },

        {
          new: true,
          runValidators: true,
        },
      )
      .select("-password");

    res.json({
      message: "Profile Updated",
      data: updatedUser,
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

export default updateProfileController;
