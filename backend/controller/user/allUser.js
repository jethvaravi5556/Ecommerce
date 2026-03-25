import userModel from "../../models/userModel.js";

async function allUserController(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        error: true,
        success: false,
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const total = await userModel.countDocuments();

    const allUsers = await userModel
      .find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All users fetched",
      data: allUsers,
      success: true,
      error: false,
      total,
      page: Number(page),
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default allUserController;
