import Review from "../models/Review.js";
import Product from "../models/Product.js";

// 🟢 Create a new review
export const createReview = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { productId, rating, comment } = req.body;

    // 1️⃣ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    // 3️⃣ Create review
    const review = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await review.save();

    // 4️⃣ Optionally update product's average rating
    const reviews = await Review.find({ productId });
    const avgRating =
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    product.averageRating = avgRating;
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// 🟡 Get all reviews for a product
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

// 🟣 Update a review
export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
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

// 🔴 Delete a review
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
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
