import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    productDetails: [
      {
        productId: String,
        name: String,
        quantity: Number,
        unitPrice: Number,
        image: [String],
      },
    ],
    shippingAddress: {
      name: String,
      address: String,
      charge: String,
      rateAmount: Number,
      currency: String,
    },

    paymentDetails: {
      paymentId: String,
      payment_method_type: [String],
      payment_status: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Delivered"],
      default: "Processing",
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "admin" if separate
    },
  },
  { timestamps: true },
);

export default mongoose.model("order", orderSchema);
