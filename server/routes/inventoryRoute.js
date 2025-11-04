import express from "express";
import { addOrUpdateInventory, getAllInventory, getInventoryByProduct } from "../controllers/inventoryController.js";
import authSeller from "../middlewares/authSeller.js";

const inventoryRoute = express.Router();

inventoryRoute.post("/add",authSeller ,addOrUpdateInventory);
inventoryRoute.get("/list",authSeller ,getAllInventory);
inventoryRoute.get("/product/:productId",authSeller, getInventoryByProduct);

export default inventoryRoute;
