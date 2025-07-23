import express from "express";
import { BookingController } from "../controller/booking-controller";
import { userAuth } from "../middleware/auth-middleware";
import { isAdmin } from "../middleware/is-admin";

export const BookingRouter = express.Router();

BookingRouter.post("/", userAuth, BookingController.create);
BookingRouter.get("/", userAuth, isAdmin, BookingController.list);
BookingRouter.get("/users", userAuth, BookingController.get);
BookingRouter.patch(
  "/:bookingId",
  userAuth,
  isAdmin,
  BookingController.updateStatus
);
BookingRouter.delete("/:bookingId", userAuth, BookingController.remove);
