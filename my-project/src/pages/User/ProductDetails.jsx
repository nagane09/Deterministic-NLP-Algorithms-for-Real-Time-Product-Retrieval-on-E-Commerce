import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/products"; 
import { getProductReviews, addReview, deleteReview } from "../../api/reviews"; // Added deleteReview
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; 
import { Star, Truck, ShieldCheck, ShoppingCart, Send, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ReviewCard from "../../components/shop/ReviewCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { handleAddToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getProductById(id);
        if (res.data.success) {
          const prodData = res.data.product;
          setProduct(prodData);
          if (prodData.variants?.length > 0) setSelectedVariant(prodData.variants[0]);
        }
        const revRes = await getProductReviews(id);
        setReviews(revRes.data || []);
      } catch (err) {
        toast.error("Failed to load product details");
      }
    };
    fetchDetails();
  }, [id]);

  const onAddToCart = async () => {
    const res = await handleAddToCart(product._id, selectedVariant?._id, quantity);
    if (res.success) toast.success("Added to cart!");
    else toast.error(res.message);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    if (!comment.trim()) return toast.error("Please enter a comment");

    setSubmittingReview(true);
    try {
      const res = await addReview({ productId: id, rating: Number(rating), comment });
      if (res.data.success) {
        toast.success("Review posted!");
        setReviews([res.data.review, ...reviews]); 
        setComment(""); 
        setRating(5);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      const res = await deleteReview(reviewId);
      if (res.status === 200) {
        toast.success("Review deleted");
        setReviews(reviews.filter(r => r._id !== reviewId));
      }
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (!product) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const basePrice = Number(selectedVariant ? selectedVariant.price : product.price) || 0;
  const hasOffer = product.offerId;
  let finalPrice = basePrice;
  if (hasOffer) {
    const offerVal = Number(hasOffer.value) || 0;
    finalPrice = hasOffer.type === "percentage" ? basePrice - (basePrice * offerVal / 100) : basePrice - offerVal;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <img src={product.images?.[selectedImage] || "https://via.placeholder.com/500"} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images?.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl border-2 transition-all ${selectedImage === i ? 'border-green-500 scale-105' : 'border-transparent opacity-70'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">{product.categoryId?.name || "Category"}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-black text-green-600">₹{finalPrice.toFixed(0)}</span>
            {hasOffer && <span className="text-xl text-gray-400 line-through">₹{basePrice}</span>}
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-6 mt-auto">
            <div className="flex items-center border-2 border-gray-100 rounded-2xl p-2 bg-gray-50">
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-1 font-bold hover:bg-white rounded-lg">-</button>
              <span className="px-4 font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="px-4 py-1 font-bold hover:bg-white rounded-lg">+</button>
            </div>
            <button onClick={onAddToCart} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2">
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="border-t pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Customer Reviews <MessageSquare className="text-green-500" />
            </h2>
            <p className="text-gray-500 mt-1">What our buyers are saying about {product.name}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl flex items-center gap-6 shadow-sm">
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">{product.averageRating?.toFixed(1) || "0.0"}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Avg Rating</p>
            </div>
            <div className="h-10 w-[1px] bg-gray-100"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">{reviews.length}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-3xl sticky top-24 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-yellow-500 bg-yellow-50 border-yellow-100' : 'text-gray-300 bg-white border-transparent'} border`}
                        >
                          <Star className={rating >= star ? 'fill-current' : ''} size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Your Feedback</label>
                    <textarea
                      rows="4"
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                      placeholder="Was the product fresh?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-100"
                  >
                    {submittingReview ? "Posting..." : <><Send size={18} /> Post Review</>}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Please login to review.</p>
                  <button onClick={() => window.location.href='/login'} className="bg-white border-2 border-green-600 text-green-600 px-6 py-2 rounded-xl font-bold hover:bg-green-50">Login</button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {reviews.length > 0 ? (
              reviews.map(r => (
                <div key={r._id} className="relative group">
                  <ReviewCard review={r} />
                  {user?.id === r.userId?._id && (
                    <button 
                      onClick={() => handleDeleteReview(r._id)}
                      className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed rounded-3xl border-gray-100 bg-gray-50/50">
                <p className="text-gray-400 italic">No reviews yet. Share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;