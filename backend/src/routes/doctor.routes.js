import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  createSlot,
  getMySlots,
  updateSlot,
  deleteSlot,
} from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), createDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

router.post("/slots", protect, authorize("DOCTOR"), createSlot);
router.get("/slots/me", protect, authorize("DOCTOR"), getMySlots);
router.put("/slots/:id", protect, authorize("DOCTOR"), updateSlot);
router.delete("/slots/:id", protect, authorize("DOCTOR"), deleteSlot);

export default router;