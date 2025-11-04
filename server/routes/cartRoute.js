import express from "express";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart
} from "../controllers/cartController.js";
import authUser from "../middlewares/authUser.js";

const cartRoute = express.Router();

cartRoute.post("/add",authUser, addToCart);
cartRoute.post("/remove",authUser, removeFromCart);
cartRoute.post("/update",authUser, updateQuantity);
cartRoute.get("/:userId",authUser, getCart);

export default cartRoute;
