import supertest from "supertest";
import { logger } from "../src/config/logging";
import {
  BookingTest,
  FieldTest,
  loginAndGetToken,
  loginAndGetTokenAdmin,
  UserTest,
} from "./test.util";
import { web } from "../src/config/web";

const now = new Date();
const startTime = new Date(now.getTime() + 60 * 60 * 1000);
const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);

describe("POST /api/bookings", () => {
  let token: string;
  let fieldId: string;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    fieldId = await FieldTest.createField();
  });

  afterEach(async () => {
    await BookingTest.deleteAll(fieldId);
    await FieldTest.deleteAll();
    await UserTest.deleteAll();
  });

  it("should can book field", async () => {
    const res = await supertest(web)
      .post(`/api/bookings`)
      .set("Cookie", [`token=${token}`])
      .send({
        fieldId,
        startTime,
        endTime,
      });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(201);
  });

  it("should reject book field if token is invalid", async () => {
    const res = await supertest(web)
      .post(`/api/bookings`)
      .set("Cookie", [`token=invalid_token`])
      .send({
        fieldId,
        startTime,
        endTime,
      });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject book field if fieldId is invalid", async () => {
    const res = await supertest(web)
      .post(`/api/bookings`)
      .set("Cookie", [`token=${token}`])
      .send({
        fieldId: "invalid_field_id",
        startTime,
        endTime,
      });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(404);
  });

  it("should reject book field if body is invalid", async () => {
    const res = await supertest(web)
      .post(`/api/bookings`)
      .set("Cookie", [`token=${token}`])
      .send({
        fieldId,
        startTime: "das",
        endTime: "asda",
      });

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("GET /api/bookings", () => {
  let tokenUser: string;
  let tokenAdmin: string;
  let fieldId: string;
  let userAdminId: string | undefined;

  beforeEach(async () => {
    await UserTest.createUser();
    await UserTest.createUserAdmin();
    tokenUser = await loginAndGetToken();
    tokenAdmin = await loginAndGetTokenAdmin();
    fieldId = await FieldTest.createField();
    userAdminId = await UserTest.getUserAdmin();

    await BookingTest.createBooking(userAdminId, fieldId);
  });

  afterEach(async () => {
    await BookingTest.deleteAll(fieldId);
    await FieldTest.deleteAll();
    await UserTest.deleteAll();
    await UserTest.deleteAllAdmin();
  });

  it("should can list bookings", async () => {
    const res = await supertest(web)
      .get(`/api/bookings`)
      .set("Cookie", [`token=${tokenAdmin}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject list bookings if token is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/bookings`)
      .set("Cookie", [`token=invalid_token`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject list bookings if user is not admin", async () => {
    const res = await supertest(web)
      .get(`/api/bookings`)
      .set("Cookie", [`token=${tokenUser}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(403);
  });
});
