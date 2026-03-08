import productModel from "../../models/productModel.js";

const getCategoryProductController = async (req, res) => {
  try {
    const productCategory = await productModel.distinct("category");

    console.log("category", productCategory);

    const productByCategory = [];

    for (const category of productCategory) {
      const product = await productModel.findOne({ category: category });

      if (product) {
        productByCategory.push(product);
      }
    }

    res.json({
      message: "Category Product",
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      messge: err.message || err,
      error: true,
      success: false,
    });
  }
};
export default getCategoryProductController;
