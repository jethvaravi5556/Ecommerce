import productModel from "../../models/productModel.js";

const getRecentlyProductController = async (req, res) => {
  try {
    const { ids } = req.body;

    console.log("recent ids =", ids);

    const products = await productModel.find({
      _id: { $in: ids },
    });

    console.log("found products =", products.length);

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
export default getRecentlyProductController;
