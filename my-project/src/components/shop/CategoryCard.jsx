import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/category/${category._id}`} 
      className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all text-center"
    >
      <div className="h-24 w-24 mx-auto mb-4 overflow-hidden rounded-full bg-green-50">
        <img 
          src={category.image || "https://via.placeholder.com/150"} 
          alt={category.name} 
          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <h3 className="font-bold text-gray-800 group-hover:text-green-600">{category.name}</h3>
      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{category.description}</p>
    </Link>
  );
};

export default CategoryCard;