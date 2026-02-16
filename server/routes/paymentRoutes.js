import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentByOrder,
} from "../controllers/paymentController.js";

import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

const paymentRoute = express.Router();

paymentRoute.post("/create", authUser, createPayment);
paymentRoute.get("/order/:orderId", authUser, getPaymentByOrder);
paymentRoute.get("/all", authSeller, getAllPayments);

export default paymentRoute;
