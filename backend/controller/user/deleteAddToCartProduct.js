import addToCartModel from "../../models/addToCartModel.js";

const deleteAddTocartProductController = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addtocartproductId = req.body._id;
    const deleteproduct = await addToCartModel.deleteOne({
      _id: addtocartproductId,
      userId: currentUserId,
    });

    res.json({
      data: deleteproduct,
      message: "Product delete successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export default deleteAddTocartProductController;
