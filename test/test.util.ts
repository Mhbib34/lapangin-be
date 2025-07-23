import supertest from "supertest";
import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
import { web } from "../src/config/web";
import path from "path";
import { startTime, endTime } from "../src/utils/booking-time";

export async function loginAndGetToken(): Promise<string> {
  const loginRes = await supertest(web).post("/api/users/login").send({
    email: "test@example.com",
    password: "rahasia",
  });

  const cookies = loginRes.headers["set-cookie"];
  if (!Array.isArray(cookies)) {
    throw new Error("Expected cookies to be an array");
  }

  const cookie = cookies.find((c: string) => c.startsWith("token="));
  if (!cookie) {
    throw new Error("Expected token cookie to exist");
  }

  return cookie.split("=")[1].split(";")[0];
}

export async function loginAndGetTokenAdmin(): Promise<string> {
  const loginRes = await supertest(web).post("/api/users/login").send({
    email: "admin@example.com",
    password: "rahasia admin",
  });

  const cookies = loginRes.headers["set-cookie"];
  if (!Array.isArray(cookies)) {
    throw new Error("Expected cookies to be an array");
  }

  const cookie = cookies.find((c: string) => c.startsWith("token="));
  if (!cookie) {
    throw new Error("Expected token cookie to exist");
  }

  return cookie.split("=")[1].split(";")[0];
}
export class UserTest {
  static async deleteAll() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@example.com",
      },
    });
  }

  static async deleteAllAdmin() {
    await prismaClient.user.deleteMany({
      where: {
        email: "admin@example.com",
      },
    });
  }

  static async createUser() {
    await prismaClient.user.create({
      data: {
        username: "test",
        password: await bcrypt.hash("rahasia", 10),
        name: "test",
        email: "test@example.com",
      },
    });
  }

  static async getUser() {
    const res = await prismaClient.user.findUnique({
      where: {
        email: "test@example.com",
      },
    });
    return res?.id;
  }

  static async getUserAdmin() {
    const res = await prismaClient.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });
    return res?.id!;
  }

  static async getresetOtp() {
    const token = await loginAndGetToken();
    await supertest(web)
      .post("/api/users/reset-otp")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "test@example.com",
      });
    const user = await prismaClient.user.findUnique({
      where: {
        email: "test@example.com",
      },
    });
    return user?.resetOtp;
  }
  static async getVerifyOtp() {
    const token = await loginAndGetToken();
    await supertest(web)
      .post("/api/users/verify-otp")
      .set("Cookie", [`token=${token}`]);

    const user = await prismaClient.user.findUnique({
      where: {
        email: "test@example.com",
      },
    });
    return user?.verifyOtp;
  }

  static async createUserAdmin() {
    await prismaClient.user.create({
      data: {
        username: "admin",
        password: await bcrypt.hash("rahasia admin", 10),
        name: "admin",
        email: "admin@example.com",
        role: "ADMIN",
      },
    });
  }
}

export class FieldTest {
  static async deleteAll() {
    await prismaClient.field.deleteMany({
      where: {
        name: "lapangan Futsal A",
      },
    });
  }

  static async createField() {
    const field = await prismaClient.field.create({
      data: {
        name: "lapangan Futsal A",
        location: "Jalan Merdeka",
        description: "Lapangan Futsal A Ini",
        pricePerHour: 200000,
        category: {
          connectOrCreate: {
            where: {
              name: "Futsal",
            },
            create: {
              name: "Futsal",
            },
          },
        },
      },
    });
    return field.id;
  }
}

export class BookingTest {
  static async deleteAll(fieldId: string) {
    await prismaClient.booking.deleteMany({
      where: {
        fieldId,
      },
    });
  }

  static async createBooking(userId: string, fieldId: string) {
    const res = await prismaClient.booking.create({
      data: {
        fieldId,
        startTime,
        endTime,
        userId,
      },
    });
    return res.id;
  }

  static async get(bookingId: string) {
    const res = await prismaClient.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
    return res;
  }
}
