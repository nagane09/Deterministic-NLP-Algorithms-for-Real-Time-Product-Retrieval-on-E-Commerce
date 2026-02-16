import { v2 as cloudinary } from "cloudinary";
import Brand from "../models/Brand.js";
import fs from "fs";

export const addBrand = async (req, res) => {
  try {
    const { name, description, country } = req.body;

    let logoUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });

      fs.unlinkSync(req.file.path);

      logoUrl = result.secure_url;
    }

    const newBrand = await Brand.create({
      name,
      description,
      country,
      logo: logoUrl,
    });

    res.json({
      success: true,
      message: "Brand added successfully",
      brand: newBrand,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    res.json({ success: true, brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
