import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { Role } from "@prisma/client";
import { UserRequestJwt } from "../type/user-request";
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../config/database";

export const userAuth = async (
  req: UserRequestJwt,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // Try to get token from cookie first (for browser requests)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token in cookie, try Authorization header (for API requests)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }

    if (!token) {
      throw new ResponseError(401, "Not authorized, Login again");
    }

    let tokenDecode;
    try {
      tokenDecode = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      throw new ResponseError(401, "Invalid or expired token");
    }

    if (
      typeof tokenDecode === "object" &&
      tokenDecode !== null &&
      "id" in tokenDecode &&
      "email" in tokenDecode
    ) {
      const { id } = tokenDecode as jwt.JwtPayload;

      const user = await prismaClient.user.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!user) {
        throw new ResponseError(401, "User not found");
      }

      req.user = user;

      console.log("✅ User authenticated:", req.user);
    } else {
      throw new ResponseError(401, "Not authorized, Login again");
    }

    next();
  } catch (error) {
    next(error);
  }
};
