import userModel from "../../models/userModel.js";

// ✅ Save an item to user's savedItems
export const saveItem = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.savedItems.includes(productId)) {
      user.savedItems.push(productId);
      await user.save();
    }

    res.json({ message: "Product saved successfully." });
  } catch (err) {
    console.error("❌ saveItem error:", err);
    res.status(500).json({ error: "Server error while saving item" });
  }
};

// ✅ Remove item from savedItems
export const unsaveItem = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.savedItems = user.savedItems.filter(
      (itemId) => itemId.toString() !== productId
    );
    await user.save();

    res.json({ message: "Product unsaved successfully." });
  } catch (err) {
    console.error("❌ unsaveItem error:", err);
    res.status(500).json({ error: "Server error while unsaving item" });
  }
};

// ✅ Get all saved items for user
export const getsavedItems = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.userId)
      .populate("savedItems");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Return just the populated saved items array
    res.json(user.savedItems || []);
  } catch (err) {
    console.error("❌ getsavedItems error:", err);
    res.status(500).json({ error: "Server error while fetching saved items" });
  }
};
