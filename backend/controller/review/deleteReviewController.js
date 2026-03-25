import reviewModel from "../../models/reviewModel.js";

const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.userId) {
      return res.json({
        success: false,
        message: "Not allowed",
      });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export default deleteReviewController;
