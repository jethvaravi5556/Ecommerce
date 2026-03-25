import reviewModel from "../../models/reviewModel.js";

const updateReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

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

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.json({
      success: true,
      message: "Review updated",
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export default updateReviewController;
