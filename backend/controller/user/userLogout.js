const userLogoutController = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User Logged Out Successfully",
      success: true,
      error: false,
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout Failed",
      error: error.message || "Unexpected error",
      success: false,
      data: [],
    });
  }
};

export default userLogoutController;
