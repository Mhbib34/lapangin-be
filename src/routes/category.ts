import express from "express";
import { userAuth } from "../middleware/auth-middleware";
import { isAdmin } from "../middleware/is-admin";
import { CategoryController } from "../controller/category-controller";

export const CategoryRouter = express.Router();

CategoryRouter.get("/", userAuth, isAdmin, CategoryController.list);
