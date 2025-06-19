import express from "express";
import { validateData } from "../middleware/validationMiddleware";
import { commentSchema } from "../schema/commentSchema";
import * as commentController from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.get("/comments", commentController.browse);
commentRouter.get("/comments/:id", commentController.getById);
commentRouter.delete("/comments/:id", commentController.remove);
commentRouter.put("/comments/:id", commentController.update);
commentRouter.post(
  "/comments",
  validateData(commentSchema),
  commentController.send,
);

export default commentRouter;
