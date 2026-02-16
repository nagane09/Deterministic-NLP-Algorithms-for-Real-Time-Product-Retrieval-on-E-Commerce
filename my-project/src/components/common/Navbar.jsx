import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, Search, LogOut, LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const { user, isSeller, logoutUser, logoutSeller } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If user is on Home, we want to trigger the AI Chat. 
      // We pass the query via URL state or parameters
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); 
    }
  };

  const handleLogout = async () => {
    try {
      if (isSeller) await logoutSeller();
      else await logoutUser();
      navigate("/login");
      window.location.reload(); 
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        <Link to="/" className="text-2xl font-bold text-green-600 shrink-0">
          GreenCart
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block">
          <input
            type="text"
            placeholder="Search products with AI..."
            className="w-full bg-gray-100 border-none rounded-full py-2 px-5 focus:ring-2 focus:ring-green-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
            <ShoppingCart size={24} />
            {cart?.items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l pl-4">
              {isSeller && (
                <Link to="/admin" className="text-blue-600 font-bold text-sm flex items-center gap-1">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
              
              <Link to="/my-orders" title="View Profile">
                <div className="h-8 w-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold border border-green-200">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Link>

              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-green-600">Login</Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;