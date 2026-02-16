import React, { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import { getAllOrders } from "../../api/orders";
import { getAllProducts } from "../../api/products";
import { getAllPayments } from "../../api/payments";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, payments: 0 });

  useEffect(() => {
    const load = async () => {
      const [oRes, pRes, payRes] = await Promise.all([getAllOrders(), getAllProducts(), getAllPayments()]);
      const totalRev = oRes.data.orders.filter(o => o.paymentStatus === 'Paid').reduce((a, b) => a + b.totalAmount, 0);
      setStats({
        revenue: totalRev,
        orders: oRes.data.orders.length,
        products: pRes.data.products.length,
        payments: payRes.data.length
      });
    };
    load();
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={`₹${stats.revenue}`} icon={<DollarSign/>} color="bg-green-100 text-green-600" />
        <StatsCard title="Total Orders" value={stats.orders} icon={<ShoppingCart/>} color="bg-blue-100 text-blue-600" />
        <StatsCard title="Live Products" value={stats.products} icon={<Package/>} color="bg-purple-100 text-purple-600" />
        <StatsCard title="Payments" value={stats.payments} icon={<DollarSign/>} color="bg-orange-100 text-orange-600" />
      </div>
      
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center">
        <h2 className="text-3xl font-black text-gray-800">Welcome, Admin</h2>
        <p className="text-gray-400 mt-2">Manage your GreenCart store growth from here.</p>
      </div>
    </div>
  );
};

export default Dashboard;