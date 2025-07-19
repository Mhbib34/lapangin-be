import { prismaClient } from "../src/config/database";
import bcrypt from "bcrypt";
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
}
