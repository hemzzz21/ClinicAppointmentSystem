import express from "express";
import {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getDoctorStats,
} from "../controllers/appointment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/available-slots/:doctorId", getAvailableSlots);
router.post("/book", protect, authorize("PATIENT"), bookAppointment);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch( "/:id/status", protect, authorize("DOCTOR"), updateAppointmentStatus);
router.get("/doctor/stats", protect, authorize("DOCTOR"), getDoctorStats);

export default router;