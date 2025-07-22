import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";

export const isAdmin = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden. Admin only." });
  }

  next();
};
