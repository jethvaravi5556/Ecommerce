import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOrderConfirmationEmail = async (to, order) => {
  const productList = order.productDetails.map(
    (item) => `${item.name} x ${item.quantity}`
  ).join("<br>");

  const html = `
    <h2>Thank you for your order!</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount}</p>
    <p><strong>Items:</strong><br>${productList}</p>
    <p><strong>Shipping Address:</strong><br>
      ${order.shippingAddress.name}<br>
      ${order.shippingAddress.address}, ${order.shippingAddress.city}<br>
      ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br>
      ${order.shippingAddress.country}
    </p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject: "Your Order Confirmation",
    html,
  });
};

export default sendOrderConfirmationEmail;
