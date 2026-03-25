import productModel from "../../models/productModel.js";

async function allProductController(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await productModel.countDocuments();

    const allProducts = await productModel
      .find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All products fetched successfully",
      data: allProducts,
      success: true,
      error: false,
      total,
      page: Number(page),
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default allProductController;
