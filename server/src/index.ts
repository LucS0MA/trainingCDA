import express, { Request, Response } from "express";
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import "reflect-metadata";
import { dataSourceBlogDB } from "./db/db";

export const app = express();

app.use(express.json());
app.use("/api", userRoutes, postRoutes, commentRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('biniou');
});

app.listen(8080, async () => {
  await dataSourceBlogDB.initialize();
  console.log("🚀 server started ! 🚀");
});
