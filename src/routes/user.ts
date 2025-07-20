import express from "express";
import { UserController } from "../controller/user-controller";
import { userAuth } from "../middleware/auth-middleware";

export const UserRouter = express.Router();

UserRouter.post("/", UserController.create);
UserRouter.post("/login", UserController.login);
UserRouter.get("/", userAuth, UserController.get);
UserRouter.patch("/", userAuth, UserController.update);
UserRouter.delete("/", userAuth, UserController.logout);
UserRouter.post("/reset-otp", userAuth, UserController.resetOtp);
UserRouter.patch("/reset-password", userAuth, UserController.resetPassword);
UserRouter.post("/verify-otp", userAuth, UserController.verifyOtp);
