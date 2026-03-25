import productModel from "../../models/productModel.js";

const filterProductController = async (req, res) => {
  try {
    const categoryList = req.body.category || [];
    const sort = req.body.sort || "";
    const minPrice = req.body.minPrice || "";
    const maxPrice = req.body.maxPrice || "";
    const page = Number(req.body.page) || 1;
    const limit = Number(req.body.limit) || 8;

    let sortQuery = {};
    if (sort === "low_to_high") sortQuery = { sellingPrice: 1 };
    if (sort === "high_to_low") sortQuery = { sellingPrice: -1 };

    let priceQuery = {};
    if (minPrice && maxPrice) {
      priceQuery = { sellingPrice: { $gte: minPrice, $lte: maxPrice } };
    } else if (minPrice) {
      priceQuery = { sellingPrice: { $gte: minPrice } };
    } else if (maxPrice) {
      priceQuery = { sellingPrice: { $lte: maxPrice } };
    }

    const query = {
      ...(categoryList.length > 0 && { category: { $in: categoryList } }),
      ...priceQuery,
    };

    const total = await productModel.countDocuments(query);

    const products = await productModel
      .find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      data: products,
      total,
      page,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

export default filterProductController;
