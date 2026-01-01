import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployeeCSV,
} from "../controllers/employee.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.use(authenticate);

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.post("/import-csv", upload.single("file"), importEmployeeCSV);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
