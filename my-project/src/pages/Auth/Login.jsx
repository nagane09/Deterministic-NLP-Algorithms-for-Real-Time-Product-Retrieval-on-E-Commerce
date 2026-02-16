import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, loginSeller } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false); 
  const { setUser, setIsSeller } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isAdminMode) {
        const res = await loginSeller({ email, password });
        if (res.data.success) {
          setIsSeller(true);
          toast.success("Seller Access Granted");
          navigate("/admin");
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await loginUser({ email, password });
        if (res.data.success) {
          setUser(res.data.user);
          toast.success(`Welcome back, ${res.data.user.name}`);
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative">
        
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setIsAdminMode(false)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isAdminMode ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
            >
              User
            </button>
            <button 
              onClick={() => setIsAdminMode(true)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isAdminMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
            >
              Seller
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isAdminMode ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {isAdminMode ? <ShieldCheck size={32} /> : <LogIn size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isAdminMode ? "Seller Portal" : "Welcome Back"}
          </h2>
          <p className="text-gray-500">Please enter your details to login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email" placeholder="Email Address" required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password" placeholder="Password" required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 ${isAdminMode ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}>
            Login as {isAdminMode ? "Seller" : "User"}
          </button>
        </form>

        {!isAdminMode && (
          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-green-600 font-bold hover:underline">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;