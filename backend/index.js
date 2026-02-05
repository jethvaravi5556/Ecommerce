import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import connectDB from "./config/db.js";
import router from "./routes/index.js";
// import webhookController from "./controller/order/webhookController.js"; // ✅ Import this
// import sendOrderConfirmationEmail from "./utils/sendEmail.js";

dotenv.config();

const app = express();

// ✅ Stripe webhook route must come BEFORE express.json
// app.post(
//   "/api/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   webhookController
// );

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);

// Test route
app.get("/api/test", (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
