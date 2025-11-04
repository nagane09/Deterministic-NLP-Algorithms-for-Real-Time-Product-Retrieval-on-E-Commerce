import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true, // e.g., "Size", "Weight", "Flavor"
  },
  value: {
    type: String,
    required: true, // e.g., "1kg", "500ml", "Chocolate"
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    unique: true
  }
}, { timestamps: true });

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
