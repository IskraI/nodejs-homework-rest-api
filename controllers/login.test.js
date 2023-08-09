import mongoose from "mongoose";
import "dotenv/config";
import request from "supertest";
import app from "../app.js";

import User from "../models/user.js";

const { DB_HOST_TEST, PORT } = process.env;

describe("test login controller", () => {
  let server = null;
  //request body
  const loginData = {
    email: "test@tt.ua",
    password: "1234567",
  };
  // перед тестами подключаемся к базе
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = await app.listen(PORT); //к серверу
    //регистрация пользоваеля для проверки логина
    await request(app).post("/users/register").send(loginData);
  });

  // после тестов отключаемся от базы
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await server.close();
  });

  test("test login status 200", async () => {
    //чтоб отправить запрос на бекєнд используем supertest
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(loginData);

    //находим юзера в базе
    const user = await User.findOne({ email: loginData.email });
    expect(user).toBeTruthy();
    // проверяем ответ
    expect(statusCode).toBe(200);
  });

  test("test login token", async () => {
    //чтоб отправить запрос на бекєнд используем supertest
    const { body } = await request(app).post("/users/login").send(loginData);

    //находим юзера в базе
    const user = await User.findOne({ email: loginData.email });
    expect(user).toBeTruthy();
    // проверяем ответ
    expect(body).toHaveProperty("token");
  });

  test("test login user", async () => {
    //чтоб отправить запрос на бекєнд используем supertest
    const { body } = await request(app).post("/users/login").send(loginData);

    //находим юзера в базе
    const user = await User.findOne({ email: loginData.email });
    expect(user).toBeTruthy();
    // проверяем ответ
    expect(body).toHaveProperty("user");
    expect(body.user).toHaveProperty("email");
    expect(user.email).toBe(loginData.email);
    expect(body.user).toHaveProperty("subscription");
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
  });
  test("login invalid user", async () => {
    const invalidLoginData = {
      email: "invalid@test.com",
      password: "incorrectpassword",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(invalidLoginData);

    expect(statusCode).toBe(401);
    expect(body).toHaveProperty("message", "Email or password is wrong");
  });
});

//Vibkd(d.zsHy2Dwq
//API
// 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
