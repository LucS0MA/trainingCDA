import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import "reflect-metadata";
import { dataSourceBlogDB } from "./db/db";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
export const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("biniou");
});

app.listen(process.env.PORT, async () => {
  await dataSourceBlogDB.initialize();
  console.log("🚀 server started ! 🚀");
});
