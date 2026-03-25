import userModel from "../../models/userModel.js";

const validateName = (name) => {
  return /^[A-Za-z\s]{3,}$/.test(name.trim());
};

const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
};

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

    if (!name || !email) {
      return res.json({
        message: "All fields required",
        success: false,
        error: true,
      });
    }

    if (!validateName(name)) {
      return res.json({
        message: "Invalid name",
        success: false,
        error: true,
      });
    }

    if (!validateEmail(email)) {
      return res.json({
        message: "Invalid email",
        success: false,
        error: true,
      });
    }

    const emailExist = await userModel.findOne({
      email,
      _id: { $ne: req.userId },
    });

    if (emailExist) {
      return res.json({
        message: "Email already in use",
        success: false,
        error: true,
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          name: name.trim().replace(/\s+/g, " "),
          email,
        },
        { new: true },
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
      message: err.message,
      success: false,
      error: true,
    });
  }
}

export default updateProfileController;
