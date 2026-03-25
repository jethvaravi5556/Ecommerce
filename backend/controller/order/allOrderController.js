import orderModel from "../../models/orderModel.js";
import userModel from "../../models/userModel.js";

const allOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
        error: true,
      });
    }

    const allOrders = await orderModel.find().sort({ createdAt: -1 });

    return res.json({
      data: allOrders,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: true,
    });
  }
};

export default allOrderController;
