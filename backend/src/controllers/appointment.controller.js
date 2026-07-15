import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAvailableSlotsService,
  bookAppointmentService,
  getMyAppointmentsService,
  cancelAppointmentService,
  updateAppointmentStatusService,
  getDoctorStatsService,
} from "../services/appointment.service.js";

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const slots = await getAvailableSlotsService(req.params.doctorId);

  res
    .status(200)
    .json(new ApiResponse(200, "Available slots fetched successfully", slots));
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await bookAppointmentService(req.user.id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Appointment booked successfully", appointment));
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await getMyAppointmentsService(req.user);

  res
    .status(200)
    .json(new ApiResponse(200, "Appointments fetched successfully", appointments));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await cancelAppointmentService(
    req.user,
    req.params.id,
    req.body.cancelReason
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Appointment cancelled successfully", appointment));
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await updateAppointmentStatusService(
    req.user.id,
    req.params.id,
    req.body.status
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Appointment status updated successfully", appointment));
});

export const getDoctorStats = asyncHandler(async (req, res) => {
  const stats = await getDoctorStatsService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Doctor stats fetched successfully", stats));
});