import reviewModel from "../../models/reviewModel.js";
import mongoose from "mongoose";
const getRatingAverageController = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await reviewModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReview: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: result[0] || { avgRating: 0, totalReview: 0 },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export default getRatingAverageController;
