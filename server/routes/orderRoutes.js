import express from "express";
import {
  createOrder,
  confirmPayment,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

const orderRoute = express.Router();

// Create order (user)
orderRoute.post("/create", authUser, createOrder);

// Confirm Stripe payment (user)
orderRoute.post("/confirm-payment", authUser, confirmPayment);

// Get user orders
orderRoute.get("/my-orders", authUser, getUserOrders);

// Admin routes
orderRoute.get("/all", authSeller, getAllOrders);
orderRoute.put("/:orderId/status", authSeller, updateOrderStatus);

export default orderRoute;
