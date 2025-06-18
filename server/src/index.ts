import express, { Request, Response } from "express";
import userRoutes from './routes/userRoutes'
import "reflect-metadata"

const app = express()

app.use(express.json());
app.use("/api", userRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('hello world')
})

app.listen(8080, () => {  console.log("🚀 server started ! 🚀")})