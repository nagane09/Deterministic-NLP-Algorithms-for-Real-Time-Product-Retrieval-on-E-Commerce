import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { handleAddToCart } = useCart();

  const hasOffer = product.offerId;
  const originalPrice = product.price;
  
  let displayPrice = originalPrice;
  if (hasOffer) {
    displayPrice = hasOffer.type === "percentage" 
      ? originalPrice - (originalPrice * hasOffer.value) / 100 
      : originalPrice - hasOffer.value;
  }

  const onAddToCart = async (e) => {
    e.preventDefault(); 
    const res = await handleAddToCart(product._id);
    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        {hasOffer && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Tag size={12} />
            {hasOffer.type === "percentage" ? `${hasOffer.value}% OFF` : `₹${hasOffer.value} OFF`}
          </div>
        )}
        <img
          src={product.images[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">
          {product.categoryId?.name || "Grocery"}
        </span>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-2 h-10">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-600">
            {product.averageRating?.toFixed(1) || "0.0"}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {hasOffer && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
            )}
            <span className="text-lg font-bold text-gray-900">₹{displayPrice}</span>
          </div>

          <button
            onClick={onAddToCart}
            className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all active:scale-95 shadow-sm"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;