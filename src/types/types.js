import { z } from "zod";

export const SignUpTypes = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const SignInTypes = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const onrampSchema = z.object({
  amount: z.number().int().positive(),
});

export const createMarketSchema = z.object({
  title: z.string().min(3),
  initialWager: z.number().int().positive(),
  side: z.enum(["yes", "no"]),
  expiry: z.coerce.date(),
});