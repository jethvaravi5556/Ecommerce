import uploadProductPermission from "../../helpers/permission.js";
import productModel from "../../models/productModel.js";

async function updateProductController(req, res) {
  try {
    if (!req.userId || !(await uploadProductPermission(req.userId))) {
      return res.status(403).json({
        message: "Permission denied: Admin access required",
        error: true,
        success: false,
      });
    }

    const { _id, productName, price, sellingPrice, ...rest } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product ID (_id) is required",
        error: true,
        success: false,
      });
    }

    if (!productName || productName.trim().length < 3) {
      return res.status(400).json({
        message: "Product name must be at least 3 characters",
        success: false,
        error: true,
      });
    }

    if (typeof price !== "number" || price < 1 || price > 10000000) {
      return res.status(400).json({
        message: "Price must be between ₹1 and ₹1,00,00,000",
        success: false,
        error: true,
      });
    }

    if (typeof sellingPrice !== "number" || sellingPrice < 1) {
      return res.status(400).json({
        message: "Invalid selling price",
        success: false,
        error: true,
      });
    }

    if (sellingPrice > price) {
      return res.status(400).json({
        message: "Selling price cannot be greater than price",
        success: false,
        error: true,
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      _id,
      {
        ...rest,
        productName: productName.trim(),
        price,
        sellingPrice,
      },
      { new: true },
    );

    if (!updateProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: updateProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

export default updateProductController;
