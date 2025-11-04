import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        default: null,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      price: {
        type: Number,
        required: true, // ✅ Final price after discount
      },
      originalPrice: {
        type: Number, // ✅ Base price before discount
      },
      discountAmount: {
        type: Number, // ✅ Amount saved per item
        default: 0,
      },
      discountType: {
        type: String,
        enum: ["percentage", "fixed", null],
        default: null,
      },
      discountValue: {
        type: Number,
        default: 0,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
