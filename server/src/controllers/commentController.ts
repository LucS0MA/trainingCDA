import { Router, Request, Response } from "express";
import { Comment } from "../entity/Comments";

const router = Router();

export const browse = async (_req: Request, res: Response) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findOne({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(404).json({ message: "no comment found" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const commentToDelete = await Comment.delete(req.params.id);
    res.status(200).json({ message: `${commentToDelete} deleted` });
  } catch (error) {
    res.status(404).json({ message: "no comment found" });
  }
};

export const send = async (req: Request, res: Response) => {
  try {
    console.log("request body", req.body);
    const newComment = new Comment();
    (newComment.content = req.body.content), newComment.save();
    res.status(200).json({ message: `Comment ${newComment} created` });
  } catch (error) {
    res.status(404).json({ message: "no comment created" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findOneByOrFail({
      id: parseInt(req.params.id),
    });
    const commentToUpdate = Object.assign(comment, req.body);
    commentToUpdate.save();
    res.status(200).json({ message: `Comment updated` });
  } catch (error) {
    res.status(404).json({ message: "no comment updated" });
  }
};

export default router;
