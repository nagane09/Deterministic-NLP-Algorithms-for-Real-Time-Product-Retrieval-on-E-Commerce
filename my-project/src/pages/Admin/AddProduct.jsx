import React, { useState, useEffect } from "react";
import { getCategories } from "../../api/categories";
import { getBrands } from "../../api/brands";
import { addProduct } from "../../api/products";
import { addOrUpdateInventory } from "../../api/inventory";
import { toast } from "react-hot-toast";
import { Upload, X, PackagePlus, Loader2 } from "lucide-react";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "", description: "", price: "", categoryId: "", brandId: "", tags: "", stock: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()]);
      setCategories(catRes.data.categories);
      setBrands(brandRes.data.brands);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    images.forEach(img => formData.append("images", img));
    
    const productData = { ...product, tags: product.tags.split(",").map(t => t.trim()) };
    formData.append("productData", JSON.stringify(productData));

    try {
      const res = await addProduct(formData);
      if (res.data.success) {
        await addOrUpdateInventory({
          productId: res.data.product._id,
          currentStock: product.stock,
          minimumLevel: 5
        });
        toast.success("Product & Inventory Created!");
        setProduct({ name: "", description: "", price: "", categoryId: "", brandId: "", tags: "", stock: 0 });
        setImages([]);
      }
    } catch (err) { toast.error("Upload failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border shadow-sm">
      <h1 className="text-2xl font-black mb-6 flex items-center gap-2"><PackagePlus className="text-green-600"/> New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" className="p-3 bg-gray-50 rounded-xl outline-none border" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} required />
          <input type="number" placeholder="Price (₹)" className="p-3 bg-gray-50 rounded-xl outline-none border" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select className="p-3 bg-gray-50 rounded-xl border" value={product.categoryId} onChange={e => setProduct({...product, categoryId: e.target.value})} required>
            <option value="">Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className="p-3 bg-gray-50 rounded-xl border" value={product.brandId} onChange={e => setProduct({...product, brandId: e.target.value})}>
            <option value="">Brand</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <input type="number" placeholder="Initial Stock Qty" className="p-3 bg-green-50 rounded-xl border-green-200 outline-none border w-full" value={product.stock} onChange={e => setProduct({...product, stock: e.target.value})} />
        <textarea placeholder="Description" className="w-full p-3 bg-gray-50 rounded-xl h-32 border" value={product.description} onChange={e => setProduct({...product, description: e.target.value})} />
        <label className="flex flex-col items-center p-6 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50">
          <Upload className="text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">{images.length > 0 ? `${images.length} images selected` : "Upload Images"}</span>
          <input type="file" multiple hidden onChange={e => setImages(Array.from(e.target.files))} />
        </label>
        <button disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center">
          {loading ? <Loader2 className="animate-spin" /> : "Publish Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;