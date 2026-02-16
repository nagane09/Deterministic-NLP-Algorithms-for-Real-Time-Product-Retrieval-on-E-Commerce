import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

export const addOrUpdateInventory = async (req, res) => {
  try {
    const { productId, variantId, currentStock, minimumLevel } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found!" });
    }

    if (variantId) {
      const variant = await Variant.findById(variantId);
      if (!variant) {
        return res.json({ success: false, message: "Variant not found!" });
      }
    }

    const existingInventory = await Inventory.findOne({ productId, variantId });

    if (existingInventory) {
      existingInventory.currentStock = currentStock;
      existingInventory.minimumLevel = minimumLevel || existingInventory.minimumLevel;
      existingInventory.lastRestocked = Date.now();
      await existingInventory.save();

      return res.json({ success: true, message: "Inventory updated successfully!", inventory: existingInventory });
    }

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
