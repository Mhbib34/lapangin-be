import express from "express";
import { UserController } from "../controller/user-controller";
import { userAuth } from "../middleware/auth-middleware";
import { isAdmin } from "../middleware/is-admin";

export const UserRouter = express.Router();

UserRouter.post("/", UserController.create);
UserRouter.post("/login", UserController.login);
UserRouter.get("/", userAuth, UserController.get);
UserRouter.get("/list", userAuth, isAdmin, UserController.list);
UserRouter.patch("/", userAuth, UserController.update);
UserRouter.patch("/password", userAuth, UserController.updatePassword);
UserRouter.delete("/", userAuth, UserController.logout);
UserRouter.post("/reset-otp", UserController.resetOtp);
UserRouter.patch("/reset-password", UserController.resetPassword);
UserRouter.post("/verify-otp", userAuth, UserController.verifyOtp);
UserRouter.patch("/verify-email", userAuth, UserController.verifyEmail);
