    import express from "express";
    import { addVariant, getVariantsByProduct } from "../controllers/variantController.js";
    import authSeller from "../middlewares/authSeller.js";

    const variantRouter = express.Router();

    variantRouter.post("/add", authSeller, addVariant);

    variantRouter.get("/:productId", getVariantsByProduct);

    export default variantRouter;
