import express from "express";
import { addBrand, getAllBrands, getBrandById } from "../controllers/brandController.js";
import authSeller from "../middlewares/authSeller.js";
import upload from "../middlewares/upload.js"; // ✅ imported here

//import multer from "multer";

// Setup multer for logo uploads
//const upload = multer({ dest: "uploads/" });

const brandRouter = express.Router();

brandRouter.post("/add", authSeller, upload.single("logo"), addBrand);
brandRouter.get("/list", getAllBrands);
brandRouter.get("/:id", getBrandById);

export default brandRouter;
