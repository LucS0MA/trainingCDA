import express, { Request, Response } from "express";
import userRoutes from './routes/userRoutes'
import "reflect-metadata"
import { dataSourceBlogDB } from "./db/db";

const app = express()

app.use(express.json());
app.use("/api", userRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('biniou')
})

app.listen(8080, async () => { await dataSourceBlogDB.initialize();
    console.log("🚀 server started ! 🚀")})