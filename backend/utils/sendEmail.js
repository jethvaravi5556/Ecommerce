import nodemailer from "nodemailer";
import dotenv from "dotenv";
import generateInvoice from "./generateInvoice.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOrderConfirmationEmail = async (to, order) => {
  const invoicePdf = await generateInvoice(order);

  const productList = order.productDetails
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${item.quantity}</td>
      </tr>
    `,
    )
    .join("");

  const html = `
  <div style="background:#f5f7fb; padding:40px; font-family:Arial">
    
    <div style="max-width:650px; margin:auto; background:white; border-radius:12px; overflow:hidden">
      
      <div style="background:linear-gradient(135deg,#43cea2,#185a9d); color:white; padding:25px; text-align:center">
        <h2>Order Confirmed 🎉</h2>
      </div>

      <div style="padding:30px">
        <p style="font-size:16px">Hello <b>${order.shippingAddress.name}</b>,</p>
        <p>Your order has been placed successfully.</p>

        <p><b>Order ID:</b> ${order._id}</p>

        <table style="width:100%; border-collapse:collapse; margin-top:20px">
          <tr style="background:#f1f1f1">
            <th style="padding:10px;text-align:left">Product</th>
            <th style="padding:10px;text-align:left">Qty</th>
          </tr>
          ${productList}
        </table>

        <h3 style="margin-top:20px">Total: ₹${order.totalAmount}</h3>

        <div style="margin-top:20px; padding:15px; background:#fafafa; border-radius:8px">
          <b>Shipping Address</b><br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
          ${order.shippingAddress.postalCode}
        </div>

        <p style="margin-top:25px">
          Invoice is attached with this email.
        </p>
      </div>

      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px">
        Thank you for shopping with us ❤️
      </div>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"YourStore" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Order Confirmation",
    html,
    attachments: [
      {
        filename: "invoice.pdf",
        content: invoicePdf,
      },
    ],
  });
};

export default sendOrderConfirmationEmail;
