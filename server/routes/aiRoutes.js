import express from "express";
import { handleAIQuery } from "../controllers/aiController.js";

const aiRoutes = express.Router();

aiRoutes.post("/ask", handleAIQuery);

export default aiRoutes;
