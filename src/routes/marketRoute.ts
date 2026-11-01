import { Router } from "express";
import { market } from "../controllers/market";
import { authMiddleware } from "../middleware";

const marketRouter = Router();

marketRouter.post("/create", authMiddleware, market);

export { marketRouter };
