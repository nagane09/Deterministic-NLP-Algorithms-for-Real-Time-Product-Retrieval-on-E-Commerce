import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";

/**
 * @desc Add a new category
 */
import fs from "fs"; 

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "This category already exists" });
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "categories",
          resource_type: "image",
        });
        imageUrl = result.secure_url;
        
        fs.unlinkSync(req.file.path); 
      } catch (uploadError) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ success: false, message: "Image upload failed" });
      }
    }

    const newCategory = await Category.create({
      name,
      description,
      image: imageUrl,
    });

    res.status(201).json({ success: true, message: "Category created", category: newCategory });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Get All Categories Error:", error.message);
    res.status(500).json({ success: false, message: "Could not fetch categories" });
  }
};

/**
 * @desc Get a category by ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error("Get Category By ID Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};