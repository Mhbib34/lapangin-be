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
import { startTime, endTime } from "../src/utils/booking-time";

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

describe("GET /api/bookings/users", () => {
  let tokenUser: string;
  let fieldId: string;
  let userId: string | undefined;

  beforeEach(async () => {
    await UserTest.createUser();
    tokenUser = await loginAndGetToken();
    fieldId = await FieldTest.createField();
    userId = await UserTest.getUser();

    await BookingTest.createBooking(userId!, fieldId);
  });

  afterEach(async () => {
    await BookingTest.deleteAll(fieldId);
    await FieldTest.deleteAll();
    await UserTest.deleteAll();
  });

  it("should can get bookings", async () => {
    const res = await supertest(web)
      .get(`/api/bookings/users`)
      .set("Cookie", [`token=${tokenUser}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject get bookings if token is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/bookings/users`)
      .set("Cookie", [`token=invalid_token`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });
});

describe("PATCH /api/bookings/:bookingId", () => {
  let tokenUser: string;
  let tokenAdmin: string;
  let fieldId: string;
  let userAdminId: string | undefined;
  let bookingId: string | undefined;

  beforeEach(async () => {
    await UserTest.createUser();
    await UserTest.createUserAdmin();
    tokenUser = await loginAndGetToken();
    tokenAdmin = await loginAndGetTokenAdmin();
    fieldId = await FieldTest.createField();
    userAdminId = await UserTest.getUserAdmin();
    bookingId = await BookingTest.createBooking(userAdminId, fieldId);
  });

  afterEach(async () => {
    await BookingTest.deleteAll(fieldId);
    await FieldTest.deleteAll();
    await UserTest.deleteAll();
    await UserTest.deleteAllAdmin();
  });

  it("should can update booking status", async () => {
    const res = await supertest(web)
      .patch(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=${tokenAdmin}`])
      .send({ status: "CONFIRMED" });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject update booking status if token is invalid", async () => {
    const res = await supertest(web)
      .patch(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=invalid_token`])
      .send({ status: "CONFIRMED" });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject update booking status if user is not admin", async () => {
    const res = await supertest(web)
      .patch(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=${tokenUser}`])
      .send({ status: "CONFIRMED" });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(403);
  });

  it("should reject update booking status if status is invalid", async () => {
    const res = await supertest(web)
      .patch(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=${tokenAdmin}`])
      .send({ status: "INVALID_STATUS" });
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("DELETE /api/bookings/:bookingId", () => {
  let token: string;
  let fieldId: string;
  let userId: string | undefined;
  let bookingId: string | undefined;

  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    fieldId = await FieldTest.createField();
    userId = await UserTest.getUser();
    bookingId = await BookingTest.createBooking(userId!, fieldId);
  });

  afterEach(async () => {
    await BookingTest.deleteAll(fieldId);
    await FieldTest.deleteAll();
    await UserTest.deleteAll();
  });

  it("should can delete booking", async () => {
    const res = await supertest(web)
      .delete(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject delete booking if token is invalid", async () => {
    const res = await supertest(web)
      .delete(`/api/bookings/${bookingId}`)
      .set("Cookie", [`token=invalid_token`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject delete booking if bookingId is invalid", async () => {
    const res = await supertest(web)
      .delete(`/api/bookings/invalid_id`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(404);
  });
});
