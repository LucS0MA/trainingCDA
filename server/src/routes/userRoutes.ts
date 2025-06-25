import express from "express";
import { validateData } from "../middleware/validationMiddleware";
import { auth } from "../middleware/verificationJWTlogin";
import { userRegistrationSchema, userLoginSchema } from "../schema/userSchema";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/users", auth, userController.browse);
userRouter.get("/users/:id", auth, userController.getById);
userRouter.delete("/users/:id", auth, userController.remove);
userRouter.put("/users/:id", auth, userController.update);
userRouter.post(
  "/register",
  validateData(userRegistrationSchema),
  userController.register,
);
userRouter.post(
  "/auth/login",
  validateData(userLoginSchema),
  userController.login,
);
userRouter.get("/auth/logout", auth, userController.logout);
userRouter.get("/auth/me", auth, userController.isAuth);

export default userRouter;
