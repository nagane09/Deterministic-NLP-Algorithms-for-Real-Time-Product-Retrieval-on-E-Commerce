import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";

// ✅ Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // If image is uploaded, send it to Cloudinary
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    // Create a new category
    const newCategory = await Category.create({
      name,
      description,
      image: imageUrl,
    });

    res.json({ success: true, message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, category });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
