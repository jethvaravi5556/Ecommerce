import addToCartModel from "../../models/addToCartModel.js";

const countAddToCartProductController = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await addToCartModel.countDocuments({ userId });

    res.json({
      data: { count },
      message: "ok",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export default countAddToCartProductController;
