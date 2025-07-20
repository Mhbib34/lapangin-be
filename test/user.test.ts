import supertest from "supertest";
import { web } from "../src/config/web";
import { logger } from "../src/config/logging";
import { loginAndGetToken, UserTest } from "./test.util";
import { email } from "zod";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can create new user", async () => {
    const res = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
      email: "test@example.com",
    });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(201);
    expect(res.body.data.username).toEqual("test");
    expect(res.body.data.name).toEqual("test");
    expect(res.body.data.email).toEqual("test@example.com");
    expect(res.body.data.role).toEqual("USER");
  });

  it("should reject if email already exist", async () => {
    await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
      email: "test@example.com",
    });
    const res = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
      email: "test@example.com",
    });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
    expect(res.body.errors).toEqual("Email already exist");
  });

  it("should reject if body is invalid", async () => {
    const res = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
      email: "",
    });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.createUser();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can login user", async () => {
    const res = await supertest(web).post("/api/users/login").send({
      email: "test@example.com",
      password: "rahasia",
    });
    logger.debug(res.body);
    logger.info(res.headers["set-cookie"]);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data.username).toEqual("test");
    expect(res.body.data.name).toEqual("test");
    expect(res.body.data.email).toEqual("test@example.com");
    expect(res.body.data.role).toEqual("USER");
  });

  it("should reject if password is wrong", async () => {
    const res = await supertest(web).post("/api/users/login").send({
      email: "test@example.com",
      password: "salah",
    });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toEqual("Email or Password wrong");
  });
  it("should reject if email is wrong", async () => {
    const res = await supertest(web).post("/api/users/login").send({
      email: "tesdasdsat@example.com",
      password: "rahasia",
    });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toEqual("Email or Password wrong");
  });

  it("should reject if body is invalid", async () => {
    const res = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("GET /api/users", () => {
  let token: string;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can get user", async () => {
    const res = await supertest(web)
      .get("/api/users")
      .set("Cookie", [`token=${token}`]);

    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.username).toEqual("test");
    expect(res.body.data.name).toEqual("test");
    expect(res.body.data.email).toEqual("test@example.com");
    expect(res.body.data.role).toEqual("USER");
  });

  it("should reject get user if token is invalid", async () => {
    const res = await supertest(web)
      .get("/api/users")
      .set("Cookie", [`token=invalid_token`]);

    console.log(res.body);

    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users", () => {
  let token: string;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can update user", async () => {
    const res = await supertest(web)
      .patch("/api/users")
      .set("Cookie", [`token=${token}`])
      .send({
        name: "test update",
        password: "rahasia baru",
        username: "test baru",
      });
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.username).toEqual("test baru");
    expect(res.body.data.name).toEqual("test update");
    expect(res.body.data.role).toEqual("USER");
  });

  it("should reject update user if token is invalid", async () => {
    const res = await supertest(web)
      .patch("/api/users")
      .set("Cookie", [`token=invalid_token`])
      .send({
        name: "test update",
        password: "rahasia baru",
        username: "test baru",
      });
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject update user if body is invalid", async () => {
    const res = await supertest(web)
      .patch("/api/users")
      .set("Cookie", [`token=${token}`])
      .send({
        name: "",
        password: "",
        username: "",
      });
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("DELETE /api/users", () => {
  let token: string;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can logout user", async () => {
    const res = await supertest(web)
      .delete("/api/users")
      .set("Cookie", [`token=${token}`]);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual("User Logout successfully");
  });
  it("should reject logout user if token is invalid", async () => {
    const res = await supertest(web)
      .delete("/api/users")
      .set("Cookie", [`token=invalid_token`]);
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/users/reset-otp", () => {
  let token: string;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can send reset password otp", async () => {
    const res = await supertest(web)
      .post("/api/users/reset-otp")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "test@example.com",
      });
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject send reset password otp if token is invalid", async () => {
    const res = await supertest(web)
      .post("/api/users/reset-otp")
      .set("Cookie", [`token=invalid_token`])
      .send({
        email: "test@example.com",
      });
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });
  it("should reject send reset password otp if request body is invalid", async () => {
    const res = await supertest(web)
      .post("/api/users/reset-otp")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "",
      });
    console.log(res.body);
    expect(res.status).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/reset-password", () => {
  let token: string;
  let otp: number;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    otp = (await UserTest.getresetOtp())!;
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should can reset password", async () => {
    const res = await supertest(web)
      .patch("/api/users/reset-password")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "test@example.com",
        otp,
        newPassword: "rahasia baru",
      });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject reset password if token is invalid", async () => {
    const res = await supertest(web)
      .patch("/api/users/reset-password")
      .set("Cookie", [`token=invalid_token`])
      .send({
        email: "test@example.com",
        otp,
        newPassword: "rahasia baru",
      });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject reset password if request body is invalid", async () => {
    const res = await supertest(web)
      .patch("/api/users/reset-password")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "test@example.com",
        otp,
        newPassword: "",
      });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });
  it("should reject reset password if otp is invalid", async () => {
    const res = await supertest(web)
      .patch("/api/users/reset-password")
      .set("Cookie", [`token=${token}`])
      .send({
        email: "test@example.com",
        otp: otp + 1,
        newPassword: "rahasia baru",
      });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });
});
