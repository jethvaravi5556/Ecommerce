import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import userModel from "../../models/userModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = async (req, res) => {
  const { cartItems, isDirectBuy } = req.body;
  const currentUser = req.userId;

  try {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "cartItems are missing or invalid" });
    }

    const user = await userModel.findById(currentUser);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["IN"], // ✅ required for shipping_option to work
      },
      shipping_options: [
        {
          shipping_rate: "shr_1RavRaFWMlxhAIlqJwBwaUXB",
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: currentUser.toString(),
        isDirectBuy: isDirectBuy ? "true" : "false",
      },

      line_items: cartItems.map((item) => {
        const imagesArray = Array.isArray(item?.productId?.productImage)
          ? item?.productId?.productImage
          : [];

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item?.productId?.productName,
              images: imagesArray.slice(0, 1), // Stripe only shows 1 image
              metadata: {
                productId: item?.productId?._id,
                images: JSON.stringify(imagesArray), // Store all images
              },
            },
            unit_amount: item?.productId?.sellingPrice * 100, // Convert to paise
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);

    console.log("paynebt b", session);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default paymentController;
