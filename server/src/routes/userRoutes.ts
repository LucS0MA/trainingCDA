import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { userRegistrationSchema } from '../schema/userSchema';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/users', userController.browse);
userRouter.get('/users/:id', userController.getById);
userRouter.delete('/users/:id', userController.remove);
userRouter.put('/users/:id', userController.update);
userRouter.post('/users', validateData(userRegistrationSchema), userController.register);


export default userRouter;