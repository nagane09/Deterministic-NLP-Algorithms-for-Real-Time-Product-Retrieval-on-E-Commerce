import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // 🔐 The user who made the payment (from JWT)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 The order this payment belongs to
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // 💰 Amount paid (taken from Order at creation)
    amount: {
      type: Number,
      required: true,
    },

    // 💳 Payment method
    method: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"],
      required: true,
    },

    // 🔖 Discount applied from order (if any)
    discountApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      default: null,
    },

    // 🧾 Gateway transaction ID or reference
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // 📦 Payment status
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },

    // 📆 Payment completion timestamp
    paidAt: {
      type: Date,
    },

    receiptUrl: {
        type: String,
        default: null,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
