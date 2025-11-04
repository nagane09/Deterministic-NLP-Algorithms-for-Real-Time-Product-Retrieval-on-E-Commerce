import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Unique Review ID (auto from MongoDB _id)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // includes createdAt & updatedAt
);

export default mongoose.model("Review", reviewSchema);
