import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().max(300),
});
