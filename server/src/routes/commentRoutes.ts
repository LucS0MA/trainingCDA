import express from "express";
import { validateData } from "../middleware/validationMiddleware";
import { commentSchema } from "../schema/commentSchema";
import * as commentController from "../controllers/commentController";
import { auth } from "../middleware/verificationJWTlogin";

const commentRouter = express.Router();

commentRouter.get("/comments", commentController.browse);
commentRouter.get("/comments/:id", auth, commentController.getById);
commentRouter.delete("/comments/:id", auth, commentController.remove);
commentRouter.put("/comments/:id", auth, commentController.update);
commentRouter.post("/comments", validateData(commentSchema), auth, commentController.send,);

export default commentRouter;
