import axios from "axios";
import cartModel from "../../models/addToCartModel.js";
import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";

const chatbotController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId || null;

    let lowerPrompt = prompt?.toLowerCase().trim();

    if (!lowerPrompt) {
      return res.json({ message: "Please type something so I can help you." });
    }

    // normalize input
    lowerPrompt = lowerPrompt.replace(/[^\w\s]/gi, "");

    // greeting
    const greetings = [
      "hi",
      "hello",
      "hii",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ];
    if (greetings.some((g) => lowerPrompt.includes(g))) {
      return res.json({
        message: "Hello! Welcome to Electronify. How can I help you today?",
      });
    }

    // help
    if (lowerPrompt.includes("help") || lowerPrompt.includes("support")) {
      return res.json({
        message:
          "I can help you with products, orders, cart, payments, delivery, and recommendations. What are you looking for?",
      });
    }

    // date
    if (lowerPrompt.includes("date") || lowerPrompt.includes("today")) {
      const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return res.json({ message: `Today is ${today}.` });
    }

    // categories
    if (lowerPrompt.includes("categories")) {
      const categories = await productModel.distinct("category");
      return res.json({
        message: `We have ${categories.length} categories: ${categories.join(", ")}.`,
      });
    }

    // product category search
    const keywords = [
      "airpods",
      "earphones",
      "headphones",
      "mobile",
      "phone",
      "smartphone",
      "camera",
      "dslr",
      "watch",
      "smartwatch",
      "speaker",
      "speakers",
      "bluetooth",
    ];

    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        const products = await productModel
          .find({
            category: new RegExp(keyword, "i"),
          })
          .limit(5);

        if (products.length > 0) {
          const list = products
            .map((p) => `${p.productName} (Rs.${p.sellingPrice})`)
            .join(", ");
          return res.json({
            message: `Yes, we have these ${keyword}: ${list}`,
          });
        } else {
          return res.json({
            message: `Sorry, no products found in ${keyword}.`,
          });
        }
      }
    }

    // price filter
    if (lowerPrompt.includes("under") || lowerPrompt.includes("below")) {
      const match = lowerPrompt.match(/\d+/);

      if (match) {
        const price = Number(match[0]);

        const products = await productModel
          .find({
            sellingPrice: { $lte: price },
          })
          .limit(5);

        if (products.length > 0) {
          const list = products
            .map((p) => `${p.productName} (Rs.${p.sellingPrice})`)
            .join(", ");
          return res.json({ message: `Products under Rs.${price}: ${list}` });
        } else {
          return res.json({ message: `No products found under Rs.${price}.` });
        }
      }
    }

    // cheap products
    if (lowerPrompt.includes("cheap") || lowerPrompt.includes("lowest")) {
      const products = await productModel
        .find()
        .sort({ sellingPrice: 1 })
        .limit(3);
      const list = products
        .map((p) => `${p.productName} (Rs.${p.sellingPrice})`)
        .join(", ");
      return res.json({ message: `Budget-friendly products: ${list}` });
    }

    // premium products
    if (lowerPrompt.includes("expensive") || lowerPrompt.includes("premium")) {
      const products = await productModel
        .find()
        .sort({ sellingPrice: -1 })
        .limit(3);
      const list = products
        .map((p) => `${p.productName} (Rs.${p.sellingPrice})`)
        .join(", ");
      return res.json({ message: `Premium products: ${list}` });
    }

    // recommendations
    if (lowerPrompt.includes("best") || lowerPrompt.includes("recommend")) {
      const products = await productModel
        .find()
        .sort({ createdAt: -1 })
        .limit(3);
      const list = products
        .map((p) => `${p.productName} (Rs.${p.sellingPrice})`)
        .join(", ");
      return res.json({ message: `Top recommendations: ${list}` });
    }

    // cart
    if (lowerPrompt.includes("cart")) {
      if (!userId) {
        return res.json({ message: "Please login to view your cart." });
      }

      const cartItems = await cartModel.find({ userId }).populate("productId");

      if (!cartItems.length) {
        return res.json({ message: "Your cart is empty." });
      }

      const summary = cartItems
        .map((c) => `${c.productId?.productName} (x${c.quantity})`)
        .join(", ");
      return res.json({ message: `Cart items: ${summary}` });
    }

    // orders
    if (lowerPrompt.includes("order")) {
      if (!userId) {
        return res.json({ message: "Please login to check your orders." });
      }

      const orders = await orderModel.find({ userId });

      if (!orders.length) {
        return res.json({ message: "You have no orders yet." });
      }

      return res.json({
        message: `You have ${orders.length} order${orders.length > 1 ? "s" : ""}.`,
      });
    }

    // order status
    if (lowerPrompt.includes("status") || lowerPrompt.includes("track")) {
      if (!userId) {
        return res.json({ message: "Please login to track your orders." });
      }

      return res.json({
        message:
          "Your latest order is being processed and will be delivered soon.",
      });
    }

    // delivery
    if (lowerPrompt.includes("delivery") || lowerPrompt.includes("shipping")) {
      return res.json({
        message: "Delivery takes 3-5 business days.",
      });
    }

    // payment
    if (
      lowerPrompt.includes("payment") ||
      lowerPrompt.includes("upi") ||
      lowerPrompt.includes("card")
    ) {
      return res.json({
        message:
          "We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery.",
      });
    }

    // return refund
    if (
      lowerPrompt.includes("return") ||
      lowerPrompt.includes("refund") ||
      lowerPrompt.includes("replace")
    ) {
      return res.json({
        message:
          "Return available within 7 days for damaged or defective items.",
      });
    }

    // stock
    if (lowerPrompt.includes("stock") || lowerPrompt.includes("available")) {
      const products = await productModel.find().limit(5);
      const list = products.map((p) => p.productName).join(", ");
      return res.json({ message: `Available products: ${list}` });
    }

    // thank you
    if (lowerPrompt.includes("thank")) {
      return res.json({ message: "You are welcome." });
    }

    // bye
    if (lowerPrompt.includes("bye")) {
      return res.json({ message: "Goodbye. Have a great day." });
    }

    // ai fallback
    let context =
      "You are a helpful assistant for an eCommerce site Electronify.";

    const categories = await productModel.distinct("category");
    context += ` Categories: ${categories.join(", ")}.`;

    if (userId) {
      const cartItems = await cartModel.find({ userId }).populate("productId");
      const orders = await orderModel.find({ userId });

      if (cartItems.length > 0) {
        context += ` Cart: ${cartItems.map((c) => c.productId?.productName).join(", ")}.`;
      }

      if (orders.length > 0) {
        context += ` Orders: ${orders.length}.`;
      }
    }

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma:2b",
      prompt: `${context}\nUser: ${prompt}`,
      stream: false,
    });

    let reply = response.data?.response || "Sorry, I did not understand that.";
    reply = reply
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\n/g, " ")
      .trim();

    res.json({ message: reply });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({
      message: "Something went wrong while generating response.",
    });
  }
};

export default chatbotController;
