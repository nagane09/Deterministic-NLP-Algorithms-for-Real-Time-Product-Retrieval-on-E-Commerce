import express from "express";
import { addDiscount, discountList, discountById } from "../controllers/discountController.js";
import authSeller from "../middlewares/authSeller.js";

const discoutRoute = express.Router();

discoutRoute.post("/add",authSeller, addDiscount);
discoutRoute.get("/list", discountList);
discoutRoute.post("/get", discountById);

export default discoutRoute;
