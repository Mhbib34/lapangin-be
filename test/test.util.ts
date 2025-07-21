import supertest from "supertest";
import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
import { web } from "../src/config/web";

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
export class UserTest {
  static async deleteAll() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@example.com",
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
}

export class FieldTest {
  static async deleteAll() {
    await prismaClient.field.deleteMany({
      where: {
        name: "lapangan Futsal A",
      },
    });
  }
}
