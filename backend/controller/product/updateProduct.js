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

    const { _id, ...resBody } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product ID (_id) is required",
        error: true,
        success: false,
      });
    }

    const updateProduct = await productModel.findByIdAndUpdate(_id, resBody, {
      new: true,
    });

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
