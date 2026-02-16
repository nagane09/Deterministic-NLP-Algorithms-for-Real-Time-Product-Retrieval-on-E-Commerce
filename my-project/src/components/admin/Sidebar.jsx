import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, PlusCircle, Boxes, ListTree, 
  ShoppingBag, Award, Tag, CreditCard, LogOut, Layers
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutSeller } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={20} /> },
    { name: "Add Variant", path: "/admin/add-variant", icon: <Layers size={20} /> },
    { name: "Inventory", path: "/admin/inventory", icon: <Boxes size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Categories", path: "/admin/categories", icon: <ListTree size={20} /> },
    { name: "Brands", path: "/admin/brands", icon: <Award size={20} /> },
    { name: "Discounts", path: "/admin/discounts", icon: <Tag size={20} /> },
    { name: "Payments", path: "/admin/payments", icon: <CreditCard size={20} /> },
  ];

  const handleLogout = async () => {
    await logoutSeller();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white h-[calc(100vh-64px)] border-r border-gray-100 flex flex-col p-4 sticky top-16 shadow-sm">
      <div className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-gray-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold mt-4 border-t pt-4">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;