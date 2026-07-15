import prisma from "../config/prisma.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const filePath = req.file.path.replace(/\\/g, "/");

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { profileImage: filePath },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Profile image uploaded successfully", user));
});