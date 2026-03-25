import addToCartModel from "../../models/addToCartModel.js";

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    if (!productId || !currentUser) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const isProductAvailable = await addToCartModel.findOne({
      productId,
      userId: currentUser,
    });

    if (isProductAvailable) {
      if (isProductAvailable.quantity >= 10) {
        return res.json({
          message: "Maximum quantity is 10",
          success: false,
          error: true,
        });
      }

      isProductAvailable.quantity += 1;

      const updatedProduct = await isProductAvailable.save();

      return res.json({
        data: updatedProduct,
        message: "Quantity updated",
        success: true,
        error: false,
      });
    }
    const payLoad = {
      productId: productId,
      quantity: 1,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payLoad);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: "Product added to cart",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export default addToCartController;
