import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createDoctorService,
  getAllDoctorsService,
  getDoctorByIdService,
  createSlotService,
  getMySlotsService,
  updateSlotService,
  deleteSlotService,
} from "../services/doctor.service.js";

export const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await createDoctorService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Doctor created successfully", doctor));
});

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await getAllDoctorsService(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Doctors fetched successfully", doctors));
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await getDoctorByIdService(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Doctor fetched successfully", doctor));
});

export const createSlot = asyncHandler(async (req, res) => {
  const slot = await createSlotService(req.user.id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Slot created successfully", slot));
});

export const getMySlots = asyncHandler(async (req, res) => {
  const slots = await getMySlotsService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Slots fetched successfully", slots));
});

export const updateSlot = asyncHandler(async (req, res) => {
  const slot = await updateSlotService(req.user.id, req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, "Slot updated successfully", slot));
});

export const deleteSlot = asyncHandler(async (req, res) => {
  await deleteSlotService(req.user.id, req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Slot deleted successfully"));
});