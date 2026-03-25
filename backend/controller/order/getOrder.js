// controller/user/getOrders.js
import orderModel from "../../models/orderModel.js";
import mongoose from "mongoose";

const getOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    // ✅ TEMP DEBUG (IMPORTANT)
    const allOrders = await orderModel.find();
    console.log(
      "All order userIds:",
      allOrders.map((o) => o.userId.toString()),
    );

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export default getOrders;
