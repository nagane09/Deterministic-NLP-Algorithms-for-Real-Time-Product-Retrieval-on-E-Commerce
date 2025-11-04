import Discount from "../models/Discount.js";
import Product from "../models/Product.js";

// ✅ Add Discount (for multiple products)
export const addDiscount = async (req, res) => {
  try {
    const { name, type, value, products, validFrom, validTo, minPurchase } = req.body;

    // Validate product IDs exist
    if (!products || products.length === 0) {
      return res.json({ success: false, message: "Please provide at least one product!" });
    }

    const existingProducts = await Product.find({ _id: { $in: products } });
    if (existingProducts.length !== products.length) {
      return res.json({ success: false, message: "One or more product IDs are invalid!" });
    }

    // Create the discount
    const discount = await Discount.create({
      name,
      type,
      value,
      products,
      validFrom,
      validTo,
      minPurchase,
    });

    // ✅ Update all related products to reference this discount
    await Product.updateMany(
      { _id: { $in: products } },
      { $set: { offerId: discount._id } }
    );

    res.json({
      success: true,
      message: "Discount added and linked to products successfully!",
      discount,
    });
  } catch (error) {
    console.error("Error adding discount:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Discounts
export const discountList = async (req, res) => {
  try {
    const discounts = await Discount.find({})
      .populate("products", "name price images");

    res.json({ success: true, discounts });
  } catch (error) {
    console.error("Error fetching discounts:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Discount by ID
export const discountById = async (req, res) => {
  try {
    const { id } = req.body;
    const discount = await Discount.findById(id)
      .populate("products", "name price images");

    if (!discount) {
      return res.json({ success: false, message: "Discount not found!" });
    }

    res.json({ success: true, discount });
  } catch (error) {
    console.error("Error fetching discount by ID:", error.message);
    res.json({ success: false, message: error.message });
  }
};
