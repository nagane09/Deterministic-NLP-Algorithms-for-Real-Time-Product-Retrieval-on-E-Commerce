import express from "express";
import { addProduct, prodById, prodList, getProductsByCategory } from "../controllers/productController.js";
import authSeller from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/upload.js"; 

const productRouter = express.Router();

productRouter.post("/add", authSeller, upload.array("images"), addProduct); 


productRouter.get("/list", authUser, prodList);

productRouter.get("/category/:categoryId", authUser, getProductsByCategory);

productRouter.get("/:id", authUser, prodById); 



export default productRouter;
