import React, { useState, useEffect } from "react";
import { getBrands, addBrand } from "../../api/brands";
import { toast } from "react-hot-toast";
import { Award, Plus, Upload, Globe, Loader2 } from "lucide-react";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState({ name: "", description: "", country: "", logo: null });
  const [preview, setPreview] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      if (res.data.success) setBrands(res.data.brands);
    } catch (err) {
      toast.error("Failed to load brands");
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandData({ ...brandData, logo: file });
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("description", brandData.description);
    formData.append("country", brandData.country);
    if (brandData.logo) formData.append("logo", brandData.logo);

    try {
      const res = await addBrand(formData);
      if (res.data.success) {
        toast.success("Brand registered successfully!");
        setBrandData({ name: "", description: "", country: "", logo: null });
        setPreview(null);
        fetchBrands();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ADD BRAND FORM */}
      <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <Plus className="text-green-600" /> Add New Brand
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Brand Name (e.g. Nestle)" 
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all" 
            value={brandData.name} 
            onChange={e => setBrandData({...brandData, name: e.target.value})} 
            required 
          />
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Origin Country" 
              className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl outline-none" 
              value={brandData.country} 
              onChange={e => setBrandData({...brandData, country: e.target.value})} 
            />
          </div>
          
          <textarea 
            placeholder="Short Description" 
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none h-24 resize-none" 
            value={brandData.description} 
            onChange={e => setBrandData({...brandData, description: e.target.value})} 
          />

          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-green-50 hover:border-green-200 transition-all text-gray-400">
            {preview ? (
              <img src={preview} alt="Preview" className="h-16 object-contain mb-2" />
            ) : (
              <Upload size={32} />
            )}
            <span className="text-xs font-medium">{brandData.logo ? brandData.logo.name : "Upload Brand Logo"}</span>
            <input type="file" hidden onChange={handleFileChange} />
          </label>

          <button 
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register Brand"}
          </button>
        </form>
      </div>

      {/* BRAND LIST */}
      <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-800">
          <Award className="text-yellow-500" /> Registered Brands ({brands.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map(brand => (
            <div key={brand._id} className="group p-6 border border-gray-50 rounded-3xl text-center bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-green-100 transition-all">
              <div className="h-16 flex items-center justify-center mb-4">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center text-gray-400 font-bold">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-sm font-black text-gray-800 mb-1">{brand.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{brand.country || "Global"}</p>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 italic">No brands added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brands;