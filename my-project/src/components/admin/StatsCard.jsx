import React from "react";

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>
      {icon}
    </div>
  </div>
);

export default StatsCard;