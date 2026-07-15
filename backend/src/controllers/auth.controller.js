import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUserService(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", result));
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body);

  res
    .status(200)
    .json(new ApiResponse(200, "Login successful", result));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", req.user));
});