import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-xl font-bold text-green-600 mb-4">GreenCart</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your premium destination for quality products. Powered by AI search to help you find exactly what you need.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Shopping</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-green-600">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-green-600">View Cart</Link></li>
            <li><Link to="/my-orders" className="hover:text-green-600">Order History</Link></li>
            <li><Link to="/ai-assistant" className="hover:text-green-600">AI Assistant</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">For Sellers</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/login" className="hover:text-green-600">Seller Login</Link></li>
            <li><Link to="/admin" className="hover:text-green-600">Admin Dashboard</Link></li>
            <li><Link to="/admin/add-product" className="hover:text-green-600">Add New Product</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/contact" className="hover:text-green-600">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-green-600">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} GreenCart E-commerce. All rights reserved. Built by Vaishnavi.
      </div>
    </footer>
  );
};

export default Footer;