import express from "express";
import bodyParser from "body-parser";
import stripe from "../configs/stripe.js";
import Order from "../models/orderModel.js";
import Inventory from "../models/inventoryModel.js";

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      const order = await Order.findById(orderId);
      if (!order || order.paymentStatus === "Paid") {
        return res.json({ received: true });
      }

      // 🔥 Reduce inventory SAFELY
      for (const item of order.items) {
        const updated = await Inventory.findOneAndUpdate(
          {
            productId: item.productId,
            variantId: item.variantId || null,
            currentStock: { $gte: item.quantity },
          },
          { $inc: { currentStock: -item.quantity } }
        );

        if (!updated) {
          console.error("Inventory mismatch for", item.productId);
        }
      }

      order.paymentStatus = "Paid";
      order.paymentMethod = "Stripe";
      order.isPaid = true;
      order.paidAt = new Date();
      order.stripePaymentId = paymentIntent.id;

      await order.save();
    }

    res.json({ received: true });
  }
);

export default router;
