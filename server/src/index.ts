import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import "reflect-metadata";
import { dataSourceBlogDB } from "./db/db";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
export const app = express();


const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"]
};

app.use(cors(options));
  
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());


app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("biniou");
});

export const initializeDatabase = async () => {
  if (!dataSourceBlogDB.isInitialized) {
    await dataSourceBlogDB.initialize();
    console.log('Base de données initialisée');
  }
};

app.listen(process.env.PORT, async () => {
  await initializeDatabase();
  console.log(`🚀 server started on ${process.env.PORT} ! 🚀`);
});