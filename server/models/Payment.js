  import mongoose from "mongoose";

  const paymentSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      method: {
        type: String,
        enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking","Stripe"],
        required: true,
      },

      discountApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
        default: null,
      },

      transactionId: {
        type: String,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        enum: ["Pending", "Success", "Failed", "Refunded"],
        default: "Pending",
      },

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
