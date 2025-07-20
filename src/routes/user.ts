import express from "express";
import { UserController } from "../controller/user-controller";
import { userAuth } from "../middleware/auth-middleware";

export const UserRouter = express.Router();

UserRouter.post("/", UserController.create);
UserRouter.post("/login", UserController.login);
UserRouter.get("/", userAuth, UserController.get);
