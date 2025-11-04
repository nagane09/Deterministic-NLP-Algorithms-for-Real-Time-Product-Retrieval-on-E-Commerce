import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files || [];

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Create the product
    await Product.create({ ...productData, images: imagesUrl });

    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Products
export const prodList = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categoryId", "name")
      .populate("brandId", "name logo")
      .populate("variants"); // 👈 NEW: Populate variants

    res.json({ success: true, products });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Single Product by ID
export const prodById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .populate("brandId", "name")
      .populate("variants"); // 👈 NEW: Populate variants

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
