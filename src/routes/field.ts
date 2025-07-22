import express from "express";
import { FieldController } from "../controller/field-controller";
import upload from "../middleware/uploadMiddleware";
import { userAuth } from "../middleware/auth-middleware";
import { isAdmin } from "../middleware/is-admin";

export const FieldRouter = express.Router();

FieldRouter.post(
  "/",
  userAuth,
  isAdmin,
  upload.single("image"),
  FieldController.create
);
FieldRouter.patch(
  "/:fieldId",
  userAuth,
  isAdmin,
  upload.single("image"),
  FieldController.update
);
FieldRouter.get("/:fieldId", userAuth, FieldController.get);
FieldRouter.delete("/:fieldId", userAuth, isAdmin, FieldController.remove);
FieldRouter.get("/", userAuth, FieldController.search);
