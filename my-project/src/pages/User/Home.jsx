import React, { useEffect, useState, useRef } from "react";
import { getCategories } from "../../api/categories";
import CategoryCard from "../../components/shop/CategoryCard";
import { useAuth } from "../../context/AuthContext";
import AiChat from "../../pages/User/AiChat"; 

const Home = () => {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  const categoryRef = useRef(null);

  const scrollToCategories = () => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error("Error loading home data", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      <section className="relative h-[500px] rounded-3xl overflow-hidden bg-green-900 flex items-center px-12 mx-4 mt-4">
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Freshness Delivered <br /> <span className="text-green-400">Right to Your Door</span>
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Experience the taste of nature with GreenCart. We source the finest 
            organic vegetables and premium groceries directly from local farms 
            to ensure you get 100% nutrition and flavor.
          </p>
          <button 
            onClick={scrollToCategories}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95"
          >
            Shop Fresh Now
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000')] bg-cover"></div>
      </section>

      <section ref={categoryRef} className="scroll-mt-24 px-4 container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Shop by Category
          </h2>
          <div className="h-1 flex-1 mx-6 bg-gray-100 rounded hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400 italic">
              Loading categories...
            </div>
          )}
        </div>
      </section>
      <AiChat />
    </div>
  );
};

export default Home;