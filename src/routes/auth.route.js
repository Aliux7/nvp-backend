import express from "express";
import { login } from "../controllers/auth/login.controller.js";
import { refreshToken } from "../controllers/auth/refresh.controller.js";
import { verifyToken } from "../controllers/auth/verify.controller.js"

const router = express.Router();

router.get("/verify", verifyToken);
router.post("/login", login);
router.post("/refresh", refreshToken);

export default router;
