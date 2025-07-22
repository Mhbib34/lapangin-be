import express from "express";
import { BookingController } from "../controller/booking-controller";
import { userAuth } from "../middleware/auth-middleware";

export const BookingRouter = express.Router();

BookingRouter.post("/", userAuth, BookingController.create);
