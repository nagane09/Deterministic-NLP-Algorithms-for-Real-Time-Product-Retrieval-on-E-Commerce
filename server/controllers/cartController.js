import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Variant from "../models/Variant.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.userId;

    const inventory = await Inventory.findOne({ 
      productId, 
      variantId: variantId || null 
    });

    if (!inventory || inventory.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${inventory ? inventory.currentStock : 0} items left in stock.`,
      });
    }

    const product = await Product.findById(productId).populate("offerId");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let finalPrice = product.price;
    if (variantId) {
      const variant = await Variant.findById(variantId);
      if (variant) finalPrice = variant.price;
    }

    let discountAmount = 0;
    if (product.offerId) {
      const discount = product.offerId;
      discountAmount = discount.type === "percentage" 
        ? (finalPrice * discount.value) / 100 
        : discount.value;
    }

    const discountedPrice = Math.max(finalPrice - discountAmount, 0);
    const subtotal = discountedPrice * quantity;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId && 
      (variantId ? item.variantId?.toString() === variantId : true)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].subtotal = cart.items[existingIndex].quantity * discountedPrice;
    } else {
      cart.items.push({ productId, variantId, quantity, price: discountedPrice, originalPrice: finalPrice, subtotal });
    }

    cart.totalAmount = cart.items.reduce((a, i) => a + i.subtotal, 0);
    cart.finalAmount = cart.totalAmount;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.status(200).json({ success: true, message: "Added to cart", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, variantId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      i => !(i.productId.toString() === productId && (variantId ? i.variantId?.toString() === variantId : true))
    );

    cart.totalAmount = cart.items.reduce((a, i) => a + i.subtotal, 0);
    cart.finalAmount = cart.totalAmount;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json({ success: true, message: "Item removed", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, variantId, quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ success: false, message: "Min quantity is 1" });

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      i => i.productId.toString() === productId && (variantId ? i.variantId?.toString() === variantId : true)
    );

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.quantity = quantity;
    item.subtotal = item.quantity * item.price;

    cart.totalAmount = cart.items.reduce((a, i) => a + i.subtotal, 0);
    cart.finalAmount = cart.totalAmount;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json({ success: true, message: "Quantity updated", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};