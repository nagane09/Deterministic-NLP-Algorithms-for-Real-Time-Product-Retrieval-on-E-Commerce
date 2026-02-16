import mongoose from "mongoose"; 
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Inventory from "../models/Inventory.js";
import { generateReceiptPdf } from "../utils/generateReceipt.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const inventory = await Inventory.findOne({
        productId: item.productId._id,
        variantId: item.variantId || null,
      });

      if (!inventory || inventory.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productId.name}`,
        });
      }
    }

    const user = await User.findById(userId);

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      variantId: item.variantId || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    const totalAmount = cart.finalAmount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "inr",
      metadata: { userId: userId.toString() },
    });

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "Stripe",
      shippingAddress: user.address,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(201).json({
      success: true,
      message: "Order created",
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not completed");
    }

    const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId }).session(session);
    if (!order) throw new Error("Order not found");

    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";
    await order.save({ session });

    for (const item of order.items) {
      const updatedInv = await Inventory.findOneAndUpdate(
        { productId: item.productId, variantId: item.variantId || null },
        { $inc: { currentStock: -item.quantity } },
        { session, new: true }
      );
      
      if (!updatedInv || updatedInv.currentStock < 0) {
        throw new Error(`Inventory sync error for product: ${item.productId}`);
      }
    }

    await Payment.create([{
      userId: order.userId,
      orderId: order._id,
      amount: order.totalAmount,
      method: "Stripe",
      transactionId: paymentIntent.id,
      status: "Success",
      paidAt: new Date(),
    }], { session });

    await Cart.deleteOne({ userId: order.userId }).session(session);

    await session.commitTransaction();
    res.json({ success: true, message: "Payment confirmed and stock updated", order });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

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

    res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
