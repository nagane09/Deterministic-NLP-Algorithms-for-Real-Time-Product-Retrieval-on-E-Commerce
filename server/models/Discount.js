import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
  minPurchase: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
