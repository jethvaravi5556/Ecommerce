import productModel from "../../models/productModel.js";

const searchProductController = async (req, res) => {
  try {
    const { q, sort, minPrice, maxPrice, page = 1, limit = 8 } = req.query;

    const regex = new RegExp(q || "", "i");

    let searchQuery = {
      $or: [{ productName: regex }, { category: regex }, { brandName: regex }],
    };

    //PRICE FILTER
    if (minPrice && maxPrice) {
      searchQuery.sellingPrice = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    } else if (minPrice) {
      searchQuery.sellingPrice = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      searchQuery.sellingPrice = { $lte: Number(maxPrice) };
    }

    // SORT
    let sortQuery = {};
    if (sort === "low_to_high") sortQuery = { sellingPrice: 1 };
    if (sort === "high_to_low") sortQuery = { sellingPrice: -1 };

    const total = await productModel.countDocuments(searchQuery);

    const Products = await productModel
      .find(searchQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      data: Products,
      success: true,
      error: false,
      total,
      page: Number(page),
      totalPage: Math.ceil(total / limit),
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
