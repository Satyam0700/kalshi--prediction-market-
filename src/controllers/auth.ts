import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { onrampSchema, SignInTypes, SignUpTypes } from "../types/types";
import { User } from "../db/user";

export const signup = async (req: Request, res: Response) => {
  const { success, data } = SignUpTypes.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { username, password } = data;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await Bun.password.hash(password);

    const user = await User.create({
      username,
      password: hashPassword,
      balance: 0,
    });

    return res.status(201).json({
      message: "Account created",
      userId: user._id,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
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

export const onramp = async (req: Request, res: Response) => {
  const { amount } = onrampSchema.parse(req.body);
  console.log(amount)
  console.log(req.user)
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.sub,
      { $inc: { balance: amount } },
      { returnDocument: 'after' },
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });

    }
    res.status(200).json({message: "Done"})
  } catch (error: any) {
    return res.status(500).json({ error: "Could not process onramp" });
  }
};
