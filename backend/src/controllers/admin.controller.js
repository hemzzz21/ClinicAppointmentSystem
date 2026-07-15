import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAdminDashboardService,
  getAllUsersService,
  getAllAppointmentsService,
} from "../services/admin.service.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getAdminDashboardService();

  res
    .status(200)
    .json(new ApiResponse(200, "Admin dashboard fetched successfully", dashboard));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService(req.query);

  res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});

export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await getAllAppointmentsService();

  res
    .status(200)
    .json(new ApiResponse(200, "Appointments fetched successfully", appointments));
});