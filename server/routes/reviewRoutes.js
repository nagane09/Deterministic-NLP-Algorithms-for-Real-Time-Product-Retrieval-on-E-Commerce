import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authUser from "../middlewares/authUser.js";


const reviewRoute = express.Router();

reviewRoute.post("/create", authUser, createReview);

reviewRoute.get("/product/:productId", getProductReviews);

reviewRoute.put("/:reviewId", authUser, updateReview);

reviewRoute.delete("/:reviewId", authUser, deleteReview);

export default reviewRoute;
