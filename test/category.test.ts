import supertest from "supertest";
import {
  CategoryTetst,
  loginAndGetToken,
  loginAndGetTokenAdmin,
  UserTest,
} from "./test.util";
import { logger } from "../src/config/logging";
import { web } from "../src/config/web";

describe("GET /api/categories", () => {
  let tokenAdmin: string;
  let tokenUser: string;

  beforeEach(async () => {
    await UserTest.createUser();
    await UserTest.createUserAdmin();
    tokenAdmin = await loginAndGetTokenAdmin();
    tokenUser = await loginAndGetToken();
    await CategoryTetst.createCategory();
  });

  afterEach(async () => {
    await UserTest.deleteAllAdmin();
    await UserTest.deleteAll();
    await CategoryTetst.deleteAll();
  });

  it("should can list categories", async () => {
    const res = await supertest(web)
      .get(`/api/categories`)
      .set("Cookie", [`token=${tokenAdmin}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject list categories if token is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/categories`)
      .set("Cookie", [`token=invalid_token`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject list categories if token is not admin", async () => {
    const res = await supertest(web)
      .get(`/api/categories`)
      .set("Cookie", [`token=${tokenUser}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(403);
  });
});
