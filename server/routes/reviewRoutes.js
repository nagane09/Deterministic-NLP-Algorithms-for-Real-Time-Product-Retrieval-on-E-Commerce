import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authUser from "../middlewares/authUser.js";


const reviewRoute = express.Router();

// 👩‍💻 User adds a review for a product
reviewRoute.post("/create", authUser, createReview);

// 🌍 Anyone can view product reviews (no auth needed)
reviewRoute.get("/product/:productId", getProductReviews);

// 👩‍💻 User updates their own review
reviewRoute.put("/:reviewId", authUser, updateReview);

// 👩‍💻 User deletes their own review
reviewRoute.delete("/:reviewId", authUser, deleteReview);

export default reviewRoute;
