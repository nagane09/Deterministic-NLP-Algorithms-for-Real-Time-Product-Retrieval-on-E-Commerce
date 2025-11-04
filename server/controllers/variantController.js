import Variant from "../models/Variant.js";
import Product from "../models/Product.js";

// ✅ Add Variant
export const addVariant = async (req, res) => {
  try {
    const { productId, name, value, price, sku } = req.body;

    // Validate required fields
    if (!productId || !name || !value || !price) {
      return res.json({ success: false, message: "All fields are required!" });
    }

    // Create variant
    const newVariant = await Variant.create({
      productId,
      name,
      value,
      price,
      sku
    });

    // Push variant reference into Product
    await Product.findByIdAndUpdate(productId, {
      $push: { variants: newVariant._id }
    });

    res.json({
      success: true,
      message: "Variant added successfully",
      variant: newVariant
    });
  } catch (error) {
    console.error("Error adding variant:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get all variants for a product
export const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await Variant.find({ productId });

    res.json({ success: true, variants });
  } catch (error) {
    console.error("Error fetching variants:", error.message);
    res.json({ success: false, message: error.message });
  }
};
