import express from "express";
import { validateData } from "../middleware/validationMiddleware";
import { postSchema } from "../schema/postSchema";
import { auth } from "../middleware/verificationJWTlogin";
import * as postController from "../controllers/postController";

const postRouter = express.Router();

postRouter.get("/posts", postController.browse);
postRouter.get("/posts/:id", postController.getById);
postRouter.delete("/posts/:id", auth, postController.remove);
postRouter.put("/posts/:id", auth, postController.update);
postRouter.post("/posts", validateData(postSchema), auth, postController.send);

export default postRouter;
