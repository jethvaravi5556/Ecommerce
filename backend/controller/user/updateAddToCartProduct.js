import addToCartModel from "../../models/addToCartModel.js";

const updateAddToCartProductController = async (req, res) => {
  try {
    const addToCartProductId = req.body._id;
    const qty = req.body.quantity;

    if (qty > 10) {
      return res.json({
        message: "Maximum quantity is 10",
        success: false,
        error: true,
      });
    }

    const updateProduct = await addToCartModel.updateOne(
      { _id: addToCartProductId },
      { quantity: qty },
    );

    res.json({
      data: updateProduct,
      message: "Product Updated",
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

export default updateAddToCartProductController;
