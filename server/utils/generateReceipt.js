import PDFDocument from "pdfkit";
import fs from "fs-extra";
import path from "path";

export const generateReceiptPdf = async ({ payment, order, user, baseDir = "uploads/receipts" }) => {
  await fs.ensureDir(baseDir);

  const fileName = `receipt_${payment._id}_${Date.now()}.pdf`;
  const filePath = path.join(baseDir, fileName);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text("Payment Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12)
        .text(`Payment ID: ${payment._id}`)
        .text(`Order ID: ${order._id}`)
        .text(`User: ${user.name} (${user.email})`)
        .text(`Amount: ₹${payment.amount}`)
        .text(`Status: ${payment.status}`)
        .text(`Paid At: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "Pending"}`)
        .moveDown()
        .text("Thank you for your purchase!", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve({ filePath, fileName }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
