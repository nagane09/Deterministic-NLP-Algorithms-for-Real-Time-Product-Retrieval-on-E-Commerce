import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    default: null // optional, if stock is at product level
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minimumLevel: {
    type: Number,
    default: 5
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
