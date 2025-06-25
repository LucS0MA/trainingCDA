import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(403).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret) as {
      id: number;
      email: string;
      username: string;
    };

    (req as any).userId = decoded.id;
    (req as any).userEmail = decoded.email;
    (req as any).userName = decoded.username;

    return next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
    return;
  }
};
