import express from "express";
import { 
    addCategory, 
    getAllCategories, 
    getCategoryById 
} from "../controllers/categoryController.js";
import authSeller from "../middlewares/authSeller.js";
import upload from "../middlewares/upload.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", authSeller, upload.single("image"), addCategory);

categoryRouter.get("/list", getAllCategories);

categoryRouter.get("/:id", getCategoryById);

export default categoryRouter;