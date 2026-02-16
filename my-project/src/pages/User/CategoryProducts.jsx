import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../../api/products";
import { getCategoryById } from "../../api/categories"; 
import ProductCard from "../../components/shop/ProductCard";
import { LayoutGrid, Filter, Loader2 } from "lucide-react";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          getProductsByCategory(categoryId),
          getCategoryById(categoryId)
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.products);
        if (catRes.data.success) setCategory(catRes.data.category);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-green-600">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold">Fetching fresh products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Category Header Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="h-32 w-32 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-gray-50">
          <img 
            src={category?.image || "https://via.placeholder.com/150"} 
            className="h-full w-full object-cover" 
            alt={category?.name} 
          />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            {category?.name || "Category"}
          </h1>
          <p className="text-gray-500 max-w-xl leading-relaxed">
            {category?.description || "Browse our collection of fresh items."}
          </p>
        </div>
      </div>

      {/* Product Results Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutGrid size={20} className="text-green-600" /> 
            Showing {products.length} Products
          </h2>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 border px-4 py-2 rounded-xl transition-all">
            <Filter size={16} /> Filter
          </button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium italic">No products found in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryProducts;