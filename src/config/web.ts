import express from "express";
import { UserRouter } from "../routes/user";
import { errorMiddleware } from "../middleware/error-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];

export const web = express();
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cors({ origin: allowedOrigins, credentials: true }));
web.use(cookieParser());

web.use("/api/users", UserRouter);

web.use(errorMiddleware);
