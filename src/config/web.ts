import express from "express";
import { UserRouter } from "../routes/user";
import { errorMiddleware } from "../middleware/error-middleware";

export const web = express();
web.use(express.json());

web.use("/api/users", UserRouter);

web.use(errorMiddleware);
