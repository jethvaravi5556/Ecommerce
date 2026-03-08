import productModel from "../../models/productModel.js";

const filterProductController = async (req, res) => {
  try {
    const categoryList = req.body.category || [];
    const sort = req.body.sort || "";

    let sortQuery = {};
    if (sort === "low_to_high") {
      sortQuery = { sellingPrice: 1 };
    } else if (sort === "high_to_low") {
      sortQuery = { sellingPrice: -1 };
    }

    const products = await productModel
      .find({
        ...(categoryList.length > 0 ? { category: { $in: categoryList } } : {}),
      })
      .sort(sortQuery);

    return res.json({
      success: true,
      error: false,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: true,
      message: err.message || "Something went wrong",
    });
  }
};
export default filterProductController;
