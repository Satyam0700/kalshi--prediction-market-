import { Router } from "express";
import { onramp, signin, signup } from "../controllers/auth";
import { authMiddleware } from "../middleware";

const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/onramp", authMiddleware, onramp);

export { authRouter };
