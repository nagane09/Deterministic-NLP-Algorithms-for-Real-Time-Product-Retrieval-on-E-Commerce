import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentByOrder,
} from "../controllers/paymentController.js";

import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

const paymentRoute = express.Router();

// 👩‍💻 User creates payment after placing an order
paymentRoute.post("/create", authUser, createPayment);

// 👩‍💻 User fetches payment info for a specific order
paymentRoute.get("/order/:orderId", authUser, getPaymentByOrder);

// 🏪 Seller/Admin can view all payments
paymentRoute.get("/all", authSeller, getAllPayments);

export default paymentRoute;
