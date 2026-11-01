import { type Request, type Response, type NextFunction } from "express";

import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload | string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorize" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECERET!);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorize" });
  }
};
