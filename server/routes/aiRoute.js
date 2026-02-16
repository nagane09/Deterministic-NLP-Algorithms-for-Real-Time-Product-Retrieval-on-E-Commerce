import express from "express";
import { aiChat } from "../controllers/aiController.js";
import authUser from "../middlewares/authUser.js";

const aiRouter = express.Router();

aiRouter.post("/chat", authUser, aiChat);

export default aiRouter;
