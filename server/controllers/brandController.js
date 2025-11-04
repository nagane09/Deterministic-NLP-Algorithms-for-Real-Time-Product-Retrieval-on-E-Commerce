import { v2 as cloudinary } from "cloudinary";
import Brand from "../models/Brand.js";

// ✅ Add a new brand
export const addBrand = async (req, res) => {
  try {
    const { name, description, country } = req.body;

    // Upload logo if provided
    let logoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      logoUrl = result.secure_url;
    }

    // Create brand in DB
    const newBrand = await Brand.create({
      name,
      description,
      country,
      logo: logoUrl,
    });

    res.json({ success: true, message: "Brand added successfully", brand: newBrand });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json({ success: true, brands });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get single brand by ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.json({ success: false, message: "Brand not found" });
    }

    res.json({ success: true, brand });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
