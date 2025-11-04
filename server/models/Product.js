import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  price: {
    type: Number,
    required: true
  },
  tags: [String],
  images: [String],
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
  },
  variants: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant"
    }
  ]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
