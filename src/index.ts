import express from "express";
import { authRouter } from "./routes/authRoute";
import mongoose from "mongoose";
import { marketRouter } from "./routes/marketRoute";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/market", marketRouter)

app.get('/', (req, res) =>{
  res.send('Hello ');
})

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI || " ");

  console.log("DB connected...");
  app.listen("3000", () => {
    console.log("running in ...");
  });
};

main().catch((err) => {
  console.log("Failed to start server..." + err);
  process.exitCode = 1;
});
