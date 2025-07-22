import supertest from "supertest";
import { FieldTest, loginAndGetToken, UserTest } from "./test.util";
import { web } from "../src/config/web";
import { logger } from "../src/config/logging";
import path from "path";

describe("POST /api/fields", () => {
  let token: string;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await FieldTest.deleteAll();
  });

  it("should can create field", async () => {
    const res = await supertest(web)
      .post("/api/fields")
      .set("Cookie", [`token=${token}`])
      .field("name", "lapangan Futsal A")
      .field("location", "Jalan Merdeka")
      .field("description", "Lapangan Futsal A Ini")
      .field("pricePerHour", 200000)
      .field("category", "Futsal")
      .attach("image", path.resolve(__dirname, "assets/futsal.png")); // pastikan file ada

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(201);
  }, 15000);

  it("should reject create field if token is invalid", async () => {
    const res = await supertest(web)
      .post("/api/fields")
      .set("Cookie", [`token=invalid_token`])
      .field("name", "lapangan Futsal A")
      .field("location", "Jalan Merdeka")
      .field("description", "Lapangan Futsal A Ini")
      .field("pricePerHour", 200000)
      .field("category", "Futsal")
      .attach("image", ""); // pastikan file ada
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject create field if request body is invalid", async () => {
    const res = await supertest(web)
      .post("/api/fields")
      .set("Cookie", [`token=${token}`])
      .field("name", "")
      .field("location", "Jalan Merdeka")
      .field("description", "Lapangan Futsal A Ini")
      .field("pricePerHour", 200000)
      .field("category", "Futsal")
      .attach("image", "");
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(400);
  });
});

describe("PATCH /api/fields/:fieldId", () => {
  let token: string;
  let id: string;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    id = await FieldTest.createField();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await FieldTest.deleteAll();
  });

  it("should can update field", async () => {
    const res = await supertest(web)
      .patch(`/api/fields/${id}`)
      .set("Cookie", [`token=${token}`])
      .field("name", "lapangan Futsal A")
      .field("location", "Jalan Merdeka asda")
      .field("description", "Lapangan Futsal A Ini asdads")
      .field("pricePerHour", 200000)
      .field("category", "Futsal");
    // .attach("image", path.resolve(__dirname, "assets/futsal.png")); // pastikan file ada
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  }, 15000);

  it("should reject update field if token is invalid", async () => {
    const res = await supertest(web)
      .patch(`/api/fields/${id}`)
      .set("Cookie", [`token=invalid_token`])
      .field("name", "lapangan Futsal A")
      .field("location", "Jalan Merdeka asda")
      .field("description", "Lapangan Futsal A Ini asdads")
      .field("pricePerHour", 200000)
      .field("category", "Futsal");
    // .attach("image", path.resolve(__dirname, "assets/futsal.png")); // pastikan file ada
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });
});

describe("GET /api/fields/:fieldId", () => {
  let token: string;
  let id: string;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    id = await FieldTest.createField();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await FieldTest.deleteAll();
  });

  it("should can get field", async () => {
    const res = await supertest(web)
      .get(`/api/fields/${id}`)
      .set("Cookie", [`token=${token}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toEqual("lapangan Futsal A");
    expect(res.body.data.location).toEqual("Jalan Merdeka");
    expect(res.body.data.description).toEqual("Lapangan Futsal A Ini");
    expect(res.body.data.pricePerHour).toEqual(200000);
    expect(res.body.data.category).toEqual("Futsal");
  });

  it("should reject get field if token is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/fields/${id}`)
      .set("Cookie", [`token=invalid_token`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject get field if field id is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/fields/invalid_id`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(404);
  });
});

describe("DELETE /api/fields/:fieldId", () => {
  let token: string;
  let id: string;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    id = await FieldTest.createField();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await FieldTest.deleteAll();
  });

  it("should can delete field", async () => {
    const res = await supertest(web)
      .delete(`/api/fields/${id}`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
  });

  it("should reject delete field if token is invalid", async () => {
    const res = await supertest(web)
      .delete(`/api/fields/${id}`)
      .set("Cookie", [`token=invalid_token`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should reject delete field if field id is invalid", async () => {
    const res = await supertest(web)
      .delete(`/api/fields/invalid_id`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(404);
  });
});

describe("GET /api/fields", () => {
  let token: string;
  beforeEach(async () => {
    await UserTest.createUser();
    token = await loginAndGetToken();
    await FieldTest.createField();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await FieldTest.deleteAll();
  });

  it("should can get fields", async () => {
    const res = await supertest(web)
      .get(`/api/fields`)
      .set("Cookie", [`token=${token}`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].name).toEqual("lapangan Futsal A");
    expect(res.body.data[0].location).toEqual("Jalan Merdeka");
    expect(res.body.data[0].description).toEqual("Lapangan Futsal A Ini");
    expect(res.body.data[0].pricePerHour).toEqual(200000);
    expect(res.body.data[0].category).toEqual("Futsal");
  });

  it("should reject get fields if token is invalid", async () => {
    const res = await supertest(web)
      .get(`/api/fields`)
      .set("Cookie", [`token=invalid_token`]);
    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(401);
  });

  it("should can get contacts with query params name", async () => {
    const res = await supertest(web)
      .get(`/api/fields?name=lapangan Futsal A`)
      .set("Cookie", [`token=${token}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].name).toEqual("lapangan Futsal A");
    expect(res.body.data[0].location).toEqual("Jalan Merdeka");
    expect(res.body.data[0].description).toEqual("Lapangan Futsal A Ini");
    expect(res.body.data[0].pricePerHour).toEqual(200000);
    expect(res.body.data[0].category).toEqual("Futsal");
  });
  it("should can get contacts with query params location", async () => {
    const res = await supertest(web)
      .get(`/api/fields?location=Jalan Merdeka`)
      .set("Cookie", [`token=${token}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].name).toEqual("lapangan Futsal A");
    expect(res.body.data[0].location).toEqual("Jalan Merdeka");
    expect(res.body.data[0].description).toEqual("Lapangan Futsal A Ini");
    expect(res.body.data[0].pricePerHour).toEqual(200000);
    expect(res.body.data[0].category).toEqual("Futsal");
  });

  it("should can get contacts with query params category", async () => {
    const res = await supertest(web)
      .get(`/api/fields?category=Futsal`)
      .set("Cookie", [`token=${token}`]);

    logger.debug(res.body);
    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].name).toEqual("lapangan Futsal A");
    expect(res.body.data[0].location).toEqual("Jalan Merdeka");
    expect(res.body.data[0].description).toEqual("Lapangan Futsal A Ini");
    expect(res.body.data[0].pricePerHour).toEqual(200000);
    expect(res.body.data[0].category).toEqual("Futsal");
  });
});
