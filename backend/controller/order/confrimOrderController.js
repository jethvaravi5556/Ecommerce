import orderModel from "../../models/orderModel.js";

const confirmOrderController = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const adminId = req.userId; // Ensure admin is authenticated

    if (!["Confirmed", "Delivered"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status, confirmedBy: adminId },
      { new: true },
    );

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export default confirmOrderController;
