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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID not valid" });
    }
    const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    res.status(201).json({ message: "User Found !" });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await User.delete(req.params.id);
    res.status(200).json({ message: `User deleted` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    console.log("request body", req.body);
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = await argon2.hash(req.body.password);
    await newUser.save();
    res.status(201).json({ message: "User created", newUser });
    res.status(200).json(newUser.id);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isAuth = async (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      id: (req as any).userId,
      username: (req as any).userName,
      email: (req as any).userEmail,
    });
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const user = await User.findOneByOrFail({ email: req.body.email });
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET_KEY as Secret,
        {
          expiresIn: "2 days",
        },
      );
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ message: `User ${user.email} connected` });
    } else {
      res.status(401).json({ message: `Invalid credentials` });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ message: `Invalid credentials` });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: `Internal server error` });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneByOrFail({ id: parseInt(req.params.id) });
    const userToUpdate = Object.assign(user, req.body);
    await userToUpdate.save();
    res.status(200).json({ message: `User updated` });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
