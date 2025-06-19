import express, { Request, Response } from "express";
import userRouter from './routes/userRoutes';
import postRouter from './routes/postRoutes';
import commentRouter from './routes/commentRoutes';
import "reflect-metadata";
import { dataSourceBlogDB } from "./db/db";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('biniou');
});

app.listen(8080, async () => {
  await dataSourceBlogDB.initialize();
  console.log("🚀 server started ! 🚀");
});
