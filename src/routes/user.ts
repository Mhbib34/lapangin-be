import express from "express";
import { UserController } from "../controller/user-controller";

export const UserRouter = express.Router();

UserRouter.post("/", UserController.create);
UserRouter.post("/login", UserController.login);
