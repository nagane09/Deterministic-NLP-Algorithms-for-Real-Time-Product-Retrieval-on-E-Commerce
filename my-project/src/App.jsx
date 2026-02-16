import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Sidebar from "./components/admin/Sidebar";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSeller, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" />

      <Navbar />

      <div className="flex flex-1">
        {isAdminPath && isSeller && <Sidebar />}

        <main className={`flex-grow transition-all duration-300 ${
          isAdminPath && isSeller ? "p-6 md:p-10" : "container mx-auto px-4 py-8"
        }`}>
          <AppRoutes />
        </main>
      </div>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;