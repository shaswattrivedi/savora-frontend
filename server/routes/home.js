import express from "express";
import { getHomeContent } from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getHomeContent);

export default router;