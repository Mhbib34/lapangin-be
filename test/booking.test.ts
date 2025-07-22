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
