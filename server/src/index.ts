import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import "reflect-metadata";
import fs from "fs";
import multer from "multer";
import { dataSourceBlogDB } from "./db/db";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
export const app = express();

const allowedOrigins = ["http://localhost:5173"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"],
};

app.use(cors(options));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req: Request, _file: any, cb: any) => cb(null, uploadsDir),
  filename: (_req: Request, file: any, cb: any) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post(
  "/api/uploads",
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({ url });
  }
);

app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("biniou");
});

export const initializeDatabase = async () => {
  if (!dataSourceBlogDB.isInitialized) {
    await dataSourceBlogDB.initialize();
    console.log("Base de données initialisée");
  }
};
