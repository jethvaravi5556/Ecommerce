import PDFDocument from "pdfkit";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const generateInvoice = (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const products = order?.productDetails || [];
    const address = order?.shippingAddress || {};

    /* ================= HEADER ================= */

    doc.rect(0, 0, 595, 110).fill("#dc2626");

    doc.fillColor("#fff").fontSize(30).text("INVOICE", 40, 45);

    doc
      .fontSize(12)
      .text("Electronify Pvt Ltd", 350, 40, { align: "right" })
      .text("Ahmedabad, Gujarat", { align: "right" })
      .text("support@electronify.com", { align: "right" });

    doc.moveDown(3);

    /* ================= ORDER INFO ================= */

    doc.fillColor("#000").fontSize(12);

    doc.text(`Invoice No: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

    /* ================= BILL TO ================= */

    doc.moveDown();

    doc.fillColor("#dc2626").fontSize(14).text("Bill To");

    doc.fillColor("#000").fontSize(11);

    doc.text(address.name || "");
    doc.text(address.address || "");

    /* ================= TABLE HEADER ================= */

    doc.moveDown(2);

    const tableTop = doc.y;

    doc.rect(40, tableTop, 515, 28).fill("#b91c1c");

    doc
      .fillColor("#fff")
      .fontSize(12)
      .text("Product", 50, tableTop + 8)
      .text("Qty", 330, tableTop + 8)
      .text("Price", 390, tableTop + 8)
      .text("Total", 470, tableTop + 8);

    let y = tableTop + 35;

    doc.fillColor("#000");

    let subtotal = 0;

    /* ================= PRODUCTS ================= */

    products.forEach((item) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.unitPrice || 0);
      const total = qty * price;

      subtotal += total;

      const productHeight = doc.heightOfString(item.name, {
        width: 260,
      });

      doc
        .fontSize(11)
        .text(item.name, 50, y, { width: 260 })
        .text(qty, 340, y)
        .text(money(price), 380, y)
        .text(money(total), 460, y);

      y += productHeight + 10;
    });

    /* ================= TOTAL ================= */

    const shipping = Number(address.rateAmount || 0);
    const grandTotal = subtotal + shipping;

    const totalBoxY = y + 20;

    doc.roundedRect(320, totalBoxY, 235, 110, 8).stroke("#fca5a5");

    doc
      .fontSize(12)
      .fillColor("#000")
      .text("Subtotal", 330, totalBoxY + 15)
      .text(money(subtotal), 450, totalBoxY + 15);

    doc
      .text("Shipping", 330, totalBoxY + 45)
      .text(shipping === 0 ? "Free" : money(shipping), 450, totalBoxY + 45);

    doc
      .fontSize(16)
      .fillColor("#dc2626")
      .text("Grand Total", 330, totalBoxY + 80)
      .text(money(order.totalAmount || grandTotal), 450, totalBoxY + 80);

    /* ================= FOOTER ================= */

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(
        "This is computer generated invoice. Thank you for shopping with Electronify ❤️",
        40,
        780,
        { align: "center", width: 515 },
      );

    doc.end();
  });
};

export default generateInvoice;
