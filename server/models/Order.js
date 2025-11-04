import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Items are taken from the user's cart at checkout
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant", // optional if variants are stored separately
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0, // discount applied per item (if any)
        },
        subtotal: {
          type: Number,
          required: true, // quantity * (price - discount)
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    discountApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount", // optional if discount is applied to total
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
