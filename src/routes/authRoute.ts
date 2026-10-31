import { Router } from "express";
import { signin, signup } from "../controllers/auth";

const authRouter = Router();

authRouter.post('/signin', signin);
authRouter.post('/signup', signup);

export { authRouter }



