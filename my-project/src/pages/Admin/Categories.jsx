import React, { useState, useEffect } from "react";
import { getCategories, addCategory } from "../../api/categories";
import { toast } from "react-hot-toast";
import { ListTree, Plus, Image as ImageIcon } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", description: "", image: null });

  const fetchCats = async () => {
    const res = await getCategories();
    if (res.data.success) setCategories(res.data.categories);
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCat.name);
    formData.append("description", newCat.description);
    if (newCat.image) formData.append("image", newCat.image);

    try {
      const res = await addCategory(formData);
      if (res.data.success) {
        toast.success("Category added");
        setNewCat({ name: "", description: "", image: null });
        fetchCats();
      }
    } catch (err) { toast.error(err.response?.data?.message); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus /> Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Category Name" className="w-full p-3 bg-gray-50 border rounded-xl" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} required />
          <textarea placeholder="Description" className="w-full p-3 bg-gray-50 border rounded-xl h-24" value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} />
          <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 text-gray-400">
            <ImageIcon size={20} /> {newCat.image ? newCat.image.name : "Upload Image"}
            <input type="file" hidden onChange={e => setNewCat({...newCat, image: e.target.files[0]})} />
          </label>
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Create</button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ListTree /> Existing Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="flex items-center gap-4 p-4 border rounded-2xl">
              <img src={cat.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
              <div>
                <p className="font-bold text-gray-800">{cat.name}</p>
                <p className="text-[10px] text-gray-400">Products: {cat.description.slice(0, 30)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;