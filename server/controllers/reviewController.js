import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.userId; 
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
    });

    const reviews = await Review.find({ productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    product.averageRating = avgRating;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: "Review not found or not yours" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: "Review not found or not yours" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
