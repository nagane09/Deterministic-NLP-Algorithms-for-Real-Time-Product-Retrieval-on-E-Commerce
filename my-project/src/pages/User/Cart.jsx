import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart as useCartContext } from "../../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cart, cartLoading, handleUpdateQuantity, handleRemoveItem } = useCartContext();
  const navigate = useNavigate();


  if (cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any fresh items yet.</p>
        <Link to="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        Your Shopping Cart <span className="text-lg font-normal text-gray-400">({cart.items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const productId = item.productId?._id || item.productId; 
            const productName = item.productId?.name || "Loading...";
            const productImage = item.productId?.images?.[0] || "https://via.placeholder.com/150";

            return (
              <div
                key={item.variantId || productId}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm"
              >
                <img
                  src={productImage}
                  alt={productName}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{productName}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Unit Price: <span className="text-green-600 font-medium">₹{item.price}</span>
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(productId, item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-bold text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(productId, item.variantId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(productId, item.variantId)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{item.subtotal}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Subtotal</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 border-b pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span className="font-medium">₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="text-gray-500 font-medium">Grand Total</span>
              <span className="text-3xl font-black text-green-600">₹{cart.finalAmount}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Proceed to Payment <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;