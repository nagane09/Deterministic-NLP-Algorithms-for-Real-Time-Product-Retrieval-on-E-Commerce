import React from "react";
import { Star, User } from "lucide-react";

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
            />
          ))}
        </div>
        <p className="text-gray-600 italic mb-4">"{review.comment || "No comment provided."}"</p>
      </div>

      <div className="flex items-center gap-3 border-t pt-4">
        <div className="h-8 w-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
          {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : <User size={14}/>}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold truncate">{review.userId?.name || "Verified User"}</p>
          <p className="text-[10px] text-gray-400">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Just now"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;