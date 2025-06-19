import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { postSchema } from '../schema/postSchema';
import * as postController from '../controllers/postController';

const postRouter = express.Router();

postRouter.get('/posts', postController.browse);
postRouter.get('/posts/:id', postController.getById);
postRouter.delete('/posts/:id', postController.remove);
postRouter.put('/posts/:id', postController.update);
postRouter.post('/posts', validateData(postSchema), postController.send);


export default postRouter;