import supertest from "supertest";
import { web } from "../src/config/web";
import { logger } from "../src/config/logging";
import { UserTest } from "./test.util";

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
