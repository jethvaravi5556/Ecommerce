import reviewModel from "../../models/reviewModel.js";

const addReviewController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    // one user → one review per product
    const already = await reviewModel.findOne({ userId, productId });

    if (already) {
      return res.json({
        message: "You already reviewed this product",
        success: false,
        error: true,
      });
    }

    const review = new reviewModel({
      userId,
      productId,
      rating,
      comment,
    });

    await review.save();

    res.json({
      message: "Review Added",
      success: true,
      error: false,
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

export default addReviewController;
