import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../api/orders";
import { Package, Clock, CheckCircle, ExternalLink, ImageOff } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.data.success) setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center font-bold text-green-600 animate-pulse">Loading your orders...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10 flex items-center gap-4 text-gray-800">
        <Package className="text-green-600" size={32} /> My Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-gray-100">
          <Package className="mx-auto text-gray-200 mb-4" size={64} />
          <p className="text-gray-400 text-lg font-medium">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-8 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex gap-10 text-sm">
                  <div>
                    <p className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Order Placed</p>
                    <p className="font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Total</p>
                    <p className="font-bold text-gray-700">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Payment</p>
                    <p className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase font-bold text-[10px] tracking-widest">Order ID</p>
                  <p className="font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-6">
                  {order.items.map((item, idx) => {
                    const product = item.productId;
                    const imageUrl = product?.images?.[0];

                    return (
                      <div key={idx} className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center">
                          {imageUrl ? (
                            <img src={imageUrl} className="w-full h-full object-cover" alt={product?.name} />
                          ) : (
                            <ImageOff className="text-gray-300" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{product?.name || "Product no longer available"}</h4>
                          <p className="text-sm text-gray-400 font-medium italic">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-lg">₹{item.subtotal}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end gap-4">
                  <button className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-2 transition-colors">
                    <ExternalLink size={16} /> View Order Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;