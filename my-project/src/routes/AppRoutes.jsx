import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Home from "../pages/User/Home";
import CategoryProducts from "../pages/User/CategoryProducts";
import ProductDetails from "../pages/User/ProductDetails";
import Cart from "../pages/User/Cart";
import Checkout from "../pages/User/Checkout";
import Orders from "../pages/User/Orders";
import AiChat from "../pages/User/AiChat";

import Dashboard from "../pages/Admin/Dashboard";
import AddProduct from "../pages/Admin/AddProduct";
import AddVariant from "../pages/Admin/AddVariant";
import Inventory from "../pages/Admin/Inventory";
import AdminOrders from "../pages/Admin/Orders";
import Categories from "../pages/Admin/Categories";
import Brands from "../pages/Admin/Brands";

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Page...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/add-product" element={<ProtectedRoute adminOnly={true}><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/add-variant" element={<ProtectedRoute adminOnly={true}><AddVariant /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute adminOnly={true}><Inventory /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute adminOnly={true}><Categories /></ProtectedRoute>} />
        <Route path="/admin/brands" element={<ProtectedRoute adminOnly={true}><Brands /></ProtectedRoute>} />

        <Route path="*" element={<div className="p-20 text-center font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;