import { Comment } from "../entity/Comments"
import { Post } from "../entity/Posts"
import { User } from "../entity/Users"
import { DataSource } from "typeorm"

export  const dataSourceBlogDB = new DataSource({
    type: "sqlite",
    database: "blog_db.sqlite",
    entities: [User, Post, Comment],
    synchronize: true,
    logging: ["error", "query"],
})
