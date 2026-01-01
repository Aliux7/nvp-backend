import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userAuthDummy } from "../../index.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const isMatch = await bcrypt.compare(password, userAuthDummy.password);

  if (email !== userAuthDummy.email || !isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@gmail.com",
    name: "Admin",
    role: "admin",
  };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
    user,
  });
};
