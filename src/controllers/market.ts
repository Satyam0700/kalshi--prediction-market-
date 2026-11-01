import { type Request, type Response } from "express";
import { createMarketSchema } from "../types/types";
import { Market } from "../db/market";
import { User } from "../db/user";

export const market = async (req: Request, res: Response) => {
  const { success, data } = createMarketSchema.safeParse(req.body);

  try {
    if (!success) {
      return res.status(404).json({ message: "Error" });
    }

    if (data.expiry <= new Date()) {
      return res.status(404).json({
        error: "Invalid expiry",
      });
    }

    const user = await User.findById(req.user?.sub);
    if (!user || data.initialWager > user.balance) {
      return res.status(404).json({ message: "Insufficient balance" });
    }
    console.log(user);

    user.balance -= data.initialWager;
    await user.save();


    const marketCreat = await Market.create({
      ...data,
      creatorId: user._id,
    });

    return res.status(201).json({"marketId": marketCreat._id});
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
