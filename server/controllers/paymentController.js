import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { generateReceiptPdf } from "../utils/generateReceipt.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, transactionId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const payment = new Payment({
      userId,
      orderId: order._id,
      amount: order.totalAmount,
      method: order.paymentMethod,
      discountApplied: order.discountApplied || null,
      transactionId,
      status: status || "Pending",
      paidAt: status === "Success" ? new Date() : null,
    });

    await payment.save();

    order.paymentStatus = payment.status;
    await order.save();

    // 🧾 Generate Receipt PDF
    const { filePath } = await generateReceiptPdf({ payment, order, user });

    // 📧 Send Email with Receipt
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop Name" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Payment Receipt",
      text: `Hi ${user.name}, here is your payment receipt for order ${order._id}.`,
      attachments: [
        {
          filename: `receipt_${payment._id}.pdf`,
          path: filePath,
        },
      ],
    });

    res.status(201).json({
      message: "Payment created, receipt generated, and email sent successfully.",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// 🟡 Get all payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("orderId", "totalAmount paymentMethod orderStatus");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

// 🟣 Get payment by orderId (for user)
export const getPaymentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId })
      .populate("orderId", "totalAmount paymentStatus orderStatus");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
};  