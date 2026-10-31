import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { SignInTypes, SignUpTypes } from "../types/types";
import { User } from "../db/user";

export const signup = async (req: Request, res: Response) => {
  const { success, data } = SignUpTypes.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { username, password } = data;

  try {
    const ExsitingUser = await User.findOne({ username });

    if (ExsitingUser) {
      return res.status(401).json({ message: "Already register" });
    }

    const hashPassword = await Bun.password.hash(password);

    const user = await User.create({
      username,
      password: hashPassword,
    });

    return res.status(201).json({
      message: "Account created",
      userId: user._id,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }

    return res.status(500).json({ error: "Could not create account" });
  }
};
export const signin = async (req: Request, res: Response) => {
  const { success, data } = SignInTypes.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { username, password } = data;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (!password || !user?.password) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECERET!, {
      expiresIn: "1D",
      algorithm: "HS256",
    });

    res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Could not sign in" });
  }
};
