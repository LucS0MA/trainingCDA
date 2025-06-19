import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(8).max(60),
  description: z.string().min(12).max(250),
  content: z.string().min(12),
});
