import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  profilePic: { type: String },
  role: { type: String, default: "GENERAL" },
  isVerified: { type: Boolean, default: false },
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] 
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;
