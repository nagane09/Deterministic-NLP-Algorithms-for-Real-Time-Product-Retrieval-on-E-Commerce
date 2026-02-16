import Variant from "../models/Variant.js";
import Product from "../models/Product.js";

export const addVariant = async (req, res) => {
  try {
    const { productId, name, value, price, sku } = req.body;

    if (!productId || !name || !value || !price) {
      return res.json({ success: false, message: "All fields are required!" });
    }

    const newVariant = await Variant.create({
      productId,
      name,
      value,
      price,
      sku
    });

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
