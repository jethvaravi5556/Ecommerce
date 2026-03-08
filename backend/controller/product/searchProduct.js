import productModel from "../../models/productModel.js";

const searchProductController = async (req, res) => {
  try {
    const query = req.query.q || "";

    const regex = new RegExp(query, "i");

    const Products = await productModel.find({
      $or: [{ productName: regex }, { category: regex }, { brandName: regex }],
    });

    res.json({
      data: Products,
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

export default searchProductController;
