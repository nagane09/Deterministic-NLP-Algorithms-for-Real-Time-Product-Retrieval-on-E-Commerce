import fs from 'fs';
import path from 'path';
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import AiMemory from "../models/AiMemory.js";


function extractFilters(text) {
  text = text.toLowerCase();
  const filters = { keywords: [], minPrice: null, maxPrice: null };

  const nums = text.match(/\d+/g)?.map(Number) || [];
  if (nums.length === 1) {
    if (/under|below|less than/.test(text)) filters.maxPrice = nums[0];
    else if (/above|more than|over/.test(text)) filters.minPrice = nums[0];
  } else if (/between/.test(text) && nums.length >= 2) {
    filters.minPrice = Math.min(nums[0], nums[1]);
    filters.maxPrice = Math.max(nums[0], nums[1]);
  }

  const garbage = ["the", "is", "and", "or", "with", "for", "to"];

  filters.keywords = text
    .split(/\s+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length >= 3 && !garbage.includes(w))
    .slice(0, 5);

  return filters;
}


export const aiChat = async (req, res) => {
  try {
    const startTime = Date.now(); 
    const { message } = req.body;
    const userId = req.userId || 'anonymous'; 
    if (!message) return res.json({ reply: "Please type something!" });

    const filters = extractFilters(message);
    const text = message.toLowerCase();

    let query = {};
    const andConditions = [];

    if (filters.keywords.length > 0) {
      andConditions.push({ $text: { $search: filters.keywords.join(" ") } });
    }

    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const priceQuery = {};
      if (filters.minPrice !== null) priceQuery.$gte = filters.minPrice;
      if (filters.maxPrice !== null) priceQuery.$lte = filters.maxPrice;
      andConditions.push({ price: priceQuery });
    }

    if (andConditions.length > 0) query = { $and: andConditions };

    const products = await Product.find(query)
      .limit(10)
      .select("name price images description")
      .lean();

    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      query: message,
      extractedFilters: filters,
      retrievedProducts: products.map(p => ({ id: p._id.toString(), name: p.name })),
      numResults: products.length,
      responseTime: Date.now() - startTime,
    };

    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const logFile = path.join(logDir, 'ai_logs.json');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

    if (!products.length) {
      return res.json({ reply: "I couldn't find exactly that. Try a different price or category!" });
    }

    res.json({
      reply: `I found ${products.length} options for you:`,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        image: p.images[0] || "",
        description: p.description
      }))
    });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ success: false, reply: "AI is currently offline." });
  }
};
