import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

export const loadAIVocabulary = async () => {
  const products = await Product.find({}, "name tags").lean();
  const categories = await Category.find({}, "name").lean();
  const brands = await Brand.find({}, "name").lean();

  return {
    productNames: products.map(p => p.name.toLowerCase()),
    tags: [
      ...new Set(products.flatMap(p => p.tags.map(t => t.toLowerCase())))
    ],
    categories: categories.map(c => c.name.toLowerCase()),
    brands: brands.map(b => b.name.toLowerCase()),
  };
};
