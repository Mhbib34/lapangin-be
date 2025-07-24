import express from "express";
import { UserRouter } from "../routes/user";
import { errorMiddleware } from "../middleware/error-middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FieldRouter } from "../routes/field";
import { BookingRouter } from "../routes/booking";

const allowedOrigins = ["http://localhost:4000", "http://localhost:8000"];

export const web = express();
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cors({ origin: allowedOrigins, credentials: true }));
web.use(cookieParser());

web.use("/api/users", UserRouter);
web.use("/api/fields", FieldRouter);
web.use("/api/bookings", BookingRouter);

web.use(errorMiddleware);
