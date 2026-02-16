import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true, 
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
