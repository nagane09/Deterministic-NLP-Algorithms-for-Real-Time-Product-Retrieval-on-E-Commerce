import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

// ✅ Add or Update Inventory
export const addOrUpdateInventory = async (req, res) => {
  try {
    const { productId, variantId, currentStock, minimumLevel } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found!" });
    }

    // If variantId is provided, check it too
    if (variantId) {
      const variant = await Variant.findById(variantId);
      if (!variant) {
        return res.json({ success: false, message: "Variant not found!" });
      }
    }

    // Check if inventory already exists for product (and variant)
    const existingInventory = await Inventory.findOne({ productId, variantId });

    if (existingInventory) {
      existingInventory.currentStock = currentStock;
      existingInventory.minimumLevel = minimumLevel || existingInventory.minimumLevel;
      existingInventory.lastRestocked = Date.now();
      await existingInventory.save();

      return res.json({ success: true, message: "Inventory updated successfully!", inventory: existingInventory });
    }

    // Otherwise, create new
    const newInventory = await Inventory.create({
      productId,
      variantId,
      currentStock,
      minimumLevel
    });

    res.json({ success: true, message: "Inventory added successfully!", inventory: newInventory });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Inventory
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({})
      .populate("productId", "name price")
      .populate("variantId", "name price");

    res.json({ success: true, inventory });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Inventory by Product
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.find({ productId })
      .populate("variantId", "name price");

    if (!inventory.length) {
      return res.json({ success: false, message: "No inventory found for this product!" });
    }

    res.json({ success: true, inventory });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
