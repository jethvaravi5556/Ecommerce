import userModel from "../../models/userModel.js"


async function updateUserController(req, res) {
  try {
    const sessionUser=req.userId;
    const { userId, email, name, role } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findById(sessionUser)

    console.log("user role",user.role)
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { email, name, role },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default updateUserController;
