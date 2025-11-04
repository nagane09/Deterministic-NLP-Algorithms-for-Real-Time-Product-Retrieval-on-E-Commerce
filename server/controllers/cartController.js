import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// 🛒 Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    const product = await Product.findById(productId).populate("offerId");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const price = variantId ? product.variants.find(v => v._id.toString() === variantId)?.price || product.price : product.price;

    // ✅ Apply discount if available and valid
    let finalPrice = price;
    if (product.offerId) {
      const offer = product.offerId;
      const now = new Date();

      if (now >= new Date(offer.validFrom) && now <= new Date(offer.validTo)) {
        if (offer.type === "percentage") {
          finalPrice = price - (price * offer.value) / 100;
        } else if (offer.type === "fixed") {
          finalPrice = price - offer.value;
        }
        if (finalPrice < 0) finalPrice = 0;
      }
    }

    const subtotal = finalPrice * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, variantId, quantity, price: finalPrice, subtotal }],
        totalAmount: subtotal,
        finalAmount: subtotal,
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          (variantId ? item.variantId?.toString() === variantId : true)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
      } else {
        cart.items.push({ productId, variantId, quantity, price: finalPrice, subtotal });
      }

      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
      cart.finalAmount = cart.totalAmount;

      await cart.save();
    }

    res.json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, variantId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.productId.toString() === productId &&
          (variantId ? item.variantId?.toString() === variantId : true))
    );

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.finalAmount = cart.totalAmount;

    await cart.save();

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔄 Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        (variantId ? i.variantId?.toString() === variantId : true)
    );

    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.finalAmount = cart.totalAmount;

    await cart.save();

    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📦 Get User Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "name price images offerId",
        populate: { path: "offerId", select: "name type value validFrom validTo" },
      })
      .populate("items.variantId", "name price");

    if (!cart) return res.json({ success: true, cart: { items: [] } });

    res.json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
