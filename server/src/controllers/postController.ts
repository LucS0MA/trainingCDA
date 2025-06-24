import { Router, Request, Response } from "express";
import { Post } from "../entity/Posts";

const router = Router();

export const browse = async (_req: Request, res: Response) => {
  try {
        const posts = await Post.find({
      relations: ['user'],
      order: { createdAt: 'DESC' } 
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ where: { id: parseInt(req.params.id) }, relations: ["user", "comments", "comments.user"] });
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(404).json({ message: "no post found" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const postToDelete = await Post.delete(req.params.id);
    res.status(200).json({ message: `${postToDelete} deleted` });
  } catch (error) {
    res.status(404).json({ message: "no post found" });
  }
};

export const send = async (req: Request, res: Response) => {
  try {
    console.log("request body", req.body);
    const newPost = new Post();
    newPost.title = req.body.title,
      newPost.description = req.body.description,
      newPost.content = req.body.content,
      newPost.user = req.body.userId,
      await newPost.save();
    res.status(200).json({ message: `Post ${newPost.title} created` });
  } catch (error) {
    res.status(400).json({ message: "Failed to create post" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOneByOrFail({ id: parseInt(req.params.id) });
    const postToUpdate = Object.assign(post, req.body);
    postToUpdate.save();
    res.status(200).json({ message: `Post updated` });
  } catch (error) {
    res.status(400).json({ message: "no post updated" });
  }
};

export default router;
