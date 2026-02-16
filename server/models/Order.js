import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        subtotal: { type: Number, required: true },
      },
    ],
    
    totalAmount: { type: Number, required: true },
    discountApplied: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Credit Card", "UPI", "Net Banking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
    shippingAddress: { type: String },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);