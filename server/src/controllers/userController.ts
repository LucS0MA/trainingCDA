import { Request, Response } from "express";
import { User } from "../entity/Users";
import * as argon2 from "argon2";
import jwt, { Secret } from "jsonwebtoken";

export const browse = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: parseInt(req.params.id) } });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(404).json({ message: "no user found" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userToDelete = await User.delete(req.params.id);
    res.status(200).json({ message: `${userToDelete} deleted` });
  } catch (error) {
    res.status(404).json({ message: "no user found" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    console.log("request body", req.body);
    const newUser = new User();
    (newUser.username = req.body.username),
      (newUser.email = req.body.email),
      (newUser.password = await argon2.hash(req.body.password)),
      newUser.save();
    res.status(200).json({ message: `User ${newUser.username} created` });
  } catch (error) {
    res.status(404).json({ message: "no user created" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const user = await User.findOneByOrFail({ email: req.body.email });
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as Secret,
        {
          expiresIn: "2 days",
        },
      );
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res
        .status(200)
        .json({ message: `User ${user.email} & ${token} connected` });
    } else {
      res.status(404).json({ message: `wrong login informations` });
    }
  } catch (error) {
    res.status(404).json({ message: `wrong login informations` });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneByOrFail({ id: parseInt(req.params.id) });
    const userToUpdate = Object.assign(user, req.body);
    userToUpdate.save();
    res.status(200).json({ message: `User updated` });
  } catch (error) {
    res.status(404).json({ message: "no user updated" });
  }
};
