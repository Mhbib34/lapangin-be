import { Response } from "express";
import jwt from "jsonwebtoken";
import { UserResponse } from "../model/user-model";

export class JwtUtils {
  static generateToken(res: Response, result: UserResponse) {
    const token = jwt.sign(
      {
        id: result.id,
        email: result.email,
        role: result.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clearToken(res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
  }
}
