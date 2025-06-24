import { Comment } from "../entity/Comments";
import { Post } from "../entity/Posts";
import { User } from "../entity/Users";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); 
const dbPath = process.env.DB_PATH || "../dbDocker/blog_db.sqlite";

export const dataSourceBlogDB = new DataSource({
  type: "sqlite",
  database: dbPath,
  entities: [User, Post, Comment],
  synchronize: true,
  logging: ["error", "query"],
});