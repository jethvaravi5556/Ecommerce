import reviewModel from "../../models/reviewModel.js";

const getProductReviewController = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    res.json({
      message: "Product Reviews",
      success: true,
      error: false,
      data: reviews,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

export default getProductReviewController;
