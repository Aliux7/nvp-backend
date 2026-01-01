import request from "supertest";
import server from "../src/index.js";

describe("Auth - Login", () => {
  it("login berhasil", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin123",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
