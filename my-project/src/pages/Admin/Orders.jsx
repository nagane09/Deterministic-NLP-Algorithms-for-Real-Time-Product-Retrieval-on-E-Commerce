import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/orders";
import { ShoppingBag, Truck, PackageCheck, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetch = async () => {
    const res = await getAllOrders();
    if (res.data.success) setOrders(res.data.orders);
  };

  useEffect(() => { fetch(); }, []);

  const handleStatus = async (orderId, status) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      if (res.data.success) {
        toast.success(`Marked as ${status}`);
        fetch();
      }
    } catch (err) { toast.error("Status update failed"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">All Customer Orders</h1>
      <div className="grid gap-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-wrap justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: {order._id.slice(-8)}</p>
              <h4 className="font-bold text-gray-800">{order.userId?.name} <span className="text-gray-400 font-medium">({order.userId?.email})</span></h4>
              <p className="text-sm font-black text-green-600">₹{order.totalAmount} • {order.paymentStatus}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleStatus(order._id, 'Confirmed')} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><PackageCheck size={20}/></button>
              <button onClick={() => handleStatus(order._id, 'Shipped')} className="p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all"><Truck size={20}/></button>
              <button onClick={() => handleStatus(order._id, 'Delivered')} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><PackageCheck size={20}/></button>
              <button onClick={() => handleStatus(order._id, 'Cancelled')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;