import express from "express";
import { addVariant, getVariantsByProduct } from "../controllers/variantController.js";
import authSeller from "../middlewares/authSeller.js";

const variantRouter = express.Router();

// ✅ Add Variant (no image upload now)
variantRouter.post("/add", authSeller, addVariant);

// ✅ Get all variants of a specific product
variantRouter.get("/:productId", getVariantsByProduct);

export default variantRouter;
