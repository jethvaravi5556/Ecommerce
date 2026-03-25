import mongoose from "mongoose";
import uploadProductPermission from "../../helpers/permission.js";
import productModel from "../../models/productModel.js";

async function deleteProductController(req, res) {
  try {
    console.log("Session User ID:", req.userId);

    // auth check
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        error: true,
        success: false,
      });
    }

    const productId = req.params.id;

    //  id required
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    // objectId validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid Product ID",
        error: true,
        success: false,
      });
    }

    //  admin permission check
    const hasPermission = await uploadProductPermission(req.userId);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        error: true,
        success: false,
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

export default deleteProductController;
