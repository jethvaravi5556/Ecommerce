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

    const newProduct = new productModel(req.body);
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
