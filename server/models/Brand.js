import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: {
    type: String // URL of logo image
  },
  description: {
    type: String,
  },
  country: {
    type: String,
  }
}, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
