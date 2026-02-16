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

orderRoute.post("/create", authUser, createOrder);
orderRoute.post("/confirm-payment", authUser, confirmPayment);
orderRoute.get("/my-orders", authUser, getUserOrders);
orderRoute.get("/all", authSeller, getAllOrders);
orderRoute.put("/:orderId/status", authSeller, updateOrderStatus);

export default orderRoute;
