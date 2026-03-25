import uploadProductPermission from "../../helpers/permission.js";
import productModel from "../../models/productModel.js";

async function uploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    const hasPermission = await uploadProductPermission(sessionUserId);
    if (!sessionUserId || !hasPermission) {
      return res.status(403).json({
        message: "User denied",
        error: true,
        success: false,
      });
    }

    const { productName, price, sellingPrice } = req.body;

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

    const newProduct = new productModel({
      ...req.body,
      productName: productName.trim(),
    });

    const savedProduct = await newProduct.save();

    res.status(200).json({
      message: "Product uploaded successfully",
      success: true,
      error: false,
      data: savedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

export default uploadProductController;
