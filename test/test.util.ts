import { prismaClient } from "../src/config/database";

export class UserTest {
  static async deleteAll() {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@example.com",
      },
    });
  }
}
