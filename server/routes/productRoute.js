import express from "express";
import { addProduct, prodById, prodList } from "../controllers/productController.js";
import authSeller from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/upload.js"; // ✅ imported here

const productRouter = express.Router();

// 🏪 Only sellers can add products
productRouter.post("/add", authSeller, upload.array("images"), addProduct);

// 👩‍💻 All users can view product list
productRouter.get("/list", authUser, prodList);

productRouter.get("/:id", authUser, prodById);

export default productRouter;
