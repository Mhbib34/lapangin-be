import express from "express";
import { FieldController } from "../controller/field-controller";
import upload from "../middleware/uploadMiddleware";
import { userAuth } from "../middleware/auth-middleware";

export const FieldRouter = express.Router();

FieldRouter.post("/", userAuth, upload.single("image"), FieldController.create);
FieldRouter.patch(
  "/:fieldId",
  userAuth,
  upload.single("image"),
  FieldController.update
);
FieldRouter.get("/:fieldId", userAuth, FieldController.get);
FieldRouter.delete("/:fieldId", userAuth, FieldController.remove);
