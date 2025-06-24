import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().max(300),
  userId: z.number(),
  postId: z.number(),
});
