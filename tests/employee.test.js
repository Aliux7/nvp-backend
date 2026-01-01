import request from "supertest";
import server from "../src/index.js";

let token = "";
let employeeId = "";

describe("Employee CRUD", () => {
  beforeAll(async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "admin@gmail.com", // harus sama dengan userAuthDummy
      password: "admin123",
    });

    expect(res.status).toBe(200);
    token = res.body.accessToken;
    expect(token).toBeDefined();
  });

  it("should create an employee", async () => {
    const res = await request(server)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        age: 30,
        position: "Developer",
        salary: 5000000,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    employeeId = res.body.data.id;
  });

  it("should get employee list", async () => {
    const res = await request(server)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should update employee", async () => {
    const res = await request(server)
      .put(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        position: "Senior Developer",
        salary: 7000000,
      }); 
    expect(res.status).toBe(200);
    expect(res.body.data.position).toBe("Senior Developer");
  });

  it("should delete employee", async () => {
    const res = await request(server)
      .delete(`/api/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Employee deleted");
  });
});
