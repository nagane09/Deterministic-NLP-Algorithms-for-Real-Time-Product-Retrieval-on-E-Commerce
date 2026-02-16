import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../api/products";
import { addVariant } from "../../api/variants";
import { toast } from "react-hot-toast";
import { Layers, Plus, IndianRupee, Hash, Loader2 } from "lucide-react";

const AddVariant = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    name: "Size", // Default name like 'Size' or 'Weight'
    value: "",    // e.g., '1kg'
    price: "",
    sku: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res.data.success) setProducts(res.data.products);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await addVariant({
        ...formData,
        price: Number(formData.price)
      });

      if (res.data.success) {
        toast.success("Variant added to product!");
        setFormData({ productId: "", name: "Size", value: "", price: "", sku: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding variant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
          <Layers size={24} />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Add Product Variant</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Product */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Target Product</label>
          <select 
            required 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.productId} 
            onChange={e => setFormData({...formData, productId: e.target.value})}
          >
            <option value="">Select a product to add variants to</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Attribute Name</label>
            <input 
              type="text" placeholder="e.g. Weight" required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          {/* Variant Value */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Value</label>
            <input 
              type="text" placeholder="e.g. 500g" required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
              value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <IndianRupee size={12}/> Variant Price
            </label>
            <input 
              type="number" placeholder="Price for this variant" required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
              value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          {/* SKU */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Hash size={12}/> SKU (Optional)
            </label>
            <input 
              type="text" placeholder="Unique ID"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
              value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20}/> Create Variant</>}
        </button>
      </form>
    </div>
  );
};

export default AddVariant;