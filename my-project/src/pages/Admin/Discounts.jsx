import React, { useState, useEffect } from "react";
import { addDiscount, getDiscounts } from "../../api/discounts";
import { getAllProducts } from "../../api/products";
import { Tag, Plus, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

const Discounts = () => {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "percentage", value: "", products: [], validFrom: "", validTo: "" });

  useEffect(() => {
    const load = async () => {
      const [pRes, dRes] = await Promise.all([getAllProducts(), getDiscounts()]);
      setProducts(pRes.data.products);
      setDiscounts(dRes.data.discounts);
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addDiscount(form);
      if (res.data.success) {
        toast.success("Offer Activated");
        window.location.reload();
      }
    } catch (err) { toast.error("Error creating discount"); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl border h-fit shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Tag className="text-orange-500"/> Create Offer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Campaign Name" className="w-full p-3 bg-gray-50 border rounded-xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <div className="flex gap-2">
            <select className="p-3 bg-gray-50 border rounded-xl flex-1" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
            <input type="number" placeholder="Value" className="p-3 bg-gray-50 border rounded-xl flex-1" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required />
          </div>
          <select multiple className="w-full p-3 bg-gray-50 border rounded-xl h-32" value={form.products} onChange={e => setForm({...form, products: Array.from(e.target.selectedOptions, o => o.value)})}>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="p-3 bg-gray-50 border rounded-xl text-xs" value={form.validFrom} onChange={e => setForm({...form, validFrom: e.target.value})} />
            <input type="date" className="p-3 bg-gray-50 border rounded-xl text-xs" value={form.validTo} onChange={e => setForm({...form, validTo: e.target.value})} />
          </div>
          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg">Launch Offer</button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 font-mono uppercase tracking-widest text-gray-400">Live Campaigns</h2>
        <div className="space-y-4">
          {discounts.map(d => (
            <div key={d._id} className="p-4 border border-dashed rounded-2xl flex justify-between items-center bg-orange-50 border-orange-200">
              <div>
                <p className="font-bold text-orange-700">{d.name}</p>
                <p className="text-xs text-orange-500">{d.type === 'percentage' ? `${d.value}% OFF` : `₹${d.value} OFF`} on {d.products.length} items</p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Calendar size={12}/> {new Date(d.validTo).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discounts;