import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  getAllAppointments,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("ADMIN"), getAdminDashboard);
router.get("/users", protect, authorize("ADMIN"), getAllUsers);
router.get("/appointments", protect, authorize("ADMIN"), getAllAppointments);

export default router;