import productModel from "../../models/productModel.js";

const getCategoryWiseProductController = async (req, res) => {
  try {
    const category = req.body.category;
    const page = Number(req.body.page) || 1;
    const limit = Number(req.body.limit) || 12;

    const query = { category };

    const total = await productModel.countDocuments(query);

    const product = await productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: product,
      success: true,
      page,
      totalPage: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};

export default getCategoryWiseProductController;
