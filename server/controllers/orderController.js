import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🟢 Create Order & Start Stripe Payment
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { paymentMethod } = req.body;

    // 1️⃣ Find user cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId || null,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      subtotal: item.subtotal,
    }));

    // 4️⃣ Calculate total
    const totalAmount = cart.total;

    // 5️⃣ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "inr",
      metadata: { userId, integration_check: "accept_a_payment" },
    });

    // 6️⃣ Create Order in DB
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      discountApplied: cart.discountApplied || null,
      paymentMethod: paymentMethod || "Stripe",
      shippingAddress: user.address,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      stripePaymentIntentId: paymentIntent.id,
    });

    await order.save();

    // 7️⃣ Clear cart after creating order
    await Cart.deleteOne({ userId });

    // 8️⃣ Respond with client secret for frontend
    res.status(201).json({
      message: "Order created successfully. Proceed to payment.",
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// 🟣 Confirm Payment (Webhook or manual)
// 🟣 Confirm Payment & Auto-Generate Receipt
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // 1️⃣ Verify payment on Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // 2️⃣ Find related order
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 3️⃣ Mark order as paid
    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";
    await order.save();

    // 4️⃣ Get user
    const user = await User.findById(order.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 5️⃣ Create payment record
    const payment = new Payment({
      userId: order.userId,
      orderId: order._id,
      amount: order.totalAmount,
      method: "Stripe",
      discountApplied: order.discountApplied || null,
      transactionId: paymentIntent.id,
      status: "Success",
      paidAt: new Date(),
    });
    await payment.save();

    // 6️⃣ Generate PDF receipt
    const { filePath } = await generateReceiptPdf({ payment, order, user });

    // 7️⃣ Send receipt email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop Name" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Payment Receipt",
      text: `Hi ${user.name}, here is your payment receipt for order ${order._id}.`,
      attachments: [
        {
          filename: `receipt_${payment._id}.pdf`,
          path: filePath,
        },
      ],
    });

    // ✅ 8️⃣ Return response
    return res.status(200).json({
      message: "Payment confirmed, receipt sent, and order updated successfully.",
      order,
      payment,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Error confirming payment", error });
  }
};

// 🟠 Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// 🟢 Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const orders = await Order.find({ userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error });
  }
};

// 🔵 Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};
