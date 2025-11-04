import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String, // URL of category image
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // For sub-categories
    default: null
  }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
