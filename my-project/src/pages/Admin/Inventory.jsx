import React, { useEffect, useState } from "react";
import { getAllInventory, addOrUpdateInventory } from "../../api/inventory";
import { Boxes, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

const Inventory = () => {
  const [stock, setStock] = useState([]);

  const fetchStock = async () => {
    const res = await getAllInventory();
    if (res.data.success) setStock(res.data.inventory);
  };

  useEffect(() => { fetchStock(); }, []);

  const handleUpdate = async (productId, currentStock) => {
    const newStock = prompt("Enter new stock level:", currentStock);
    if (newStock === null) return;
    
    try {
      const res = await addOrUpdateInventory({ productId, currentStock: Number(newStock) });
      if (res.data.success) {
        toast.success("Stock Updated");
        fetchStock();
      }
    } catch (err) { toast.error("Failed to update"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black flex items-center gap-2"><Boxes className="text-blue-600"/> Inventory Dashboard</h1>
      <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stock.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{item.productId?.name}</td>
                <td className="px-6 py-4 font-mono">{item.currentStock} units</td>
                <td className="px-6 py-4">
                  {item.currentStock <= item.minimumLevel ? (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><AlertTriangle size={14}/> Low Stock</span>
                  ) : (
                    <span className="text-green-500 text-xs font-bold font-mono">Healthy</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleUpdate(item.productId?._id, item.currentStock)} className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
                    <RefreshCw size={14}/> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;