import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import employeeRoutes from "./routes/employee.route.js";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./socket.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.get("/", (req, res) => {
  res.send("NVP Backend Running");
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app); 
initSocket(server);

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export let userAuthDummy;

const initUser = async () => {
  userAuthDummy = {
    email: "admin@gmail.com",
    password: await bcrypt.hash("admin123", 10),
  };
};

await initUser();

export default server;
