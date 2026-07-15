import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

export const createDoctorService = async (data) => {
  const {
    name,
    email,
    password,
    phone,
    specialization,
    qualification,
    experienceYears,
    consultationFee,
    bio,
    clinicLocation,
    slotDurationMinutes,
  } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "Doctor already exists with this email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const doctor = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: "DOCTOR",
      doctorProfile: {
        create: {
          specialization,
          qualification,
          experienceYears,
          consultationFee,
          bio,
          clinicLocation,
          slotDurationMinutes: slotDurationMinutes || 30,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      doctorProfile: true,
    },
  });

  return doctor;
};
export const getAllDoctorsService = async (query) => {
  const {
    search = "",
    specialization,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    role: "DOCTOR",
    isActive: true,
  };

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (specialization) {
    where.doctorProfile = {
      specialization: {
        contains: specialization,
        mode: "insensitive",
      },
    };
  }

  const [doctors, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        doctorProfile: true,
      },
      skip,
      take: Number(limit),
      orderBy: {
        [sort]: order,
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    doctors,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};
 

export const getDoctorByIdService = async (id) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: Number(id),
      role: "DOCTOR",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      doctorProfile: true,
    },
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  return doctor;
};

export const createSlotService = async (doctorUserId, data) => {
  const { slotDate, startTime, endTime } = data;

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorUserId },
  });

  if (!doctorProfile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  const start = new Date(`${slotDate}T${startTime}`);
  const end = new Date(`${slotDate}T${endTime}`);

  if (end <= start) {
    throw new ApiError(400, "End time must be after start time");
  }

  const overlappingSlot = await prisma.availabilitySlot.findFirst({
    where: {
      doctorId: doctorProfile.id,
      slotDate: new Date(slotDate),
      OR: [
        {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      ],
    },
  });

  if (overlappingSlot) {
    throw new ApiError(409, "Slot overlaps with an existing slot");
  }

  return await prisma.availabilitySlot.create({
    data: {
      doctorId: doctorProfile.id,
      slotDate: new Date(slotDate),
      startTime: start,
      endTime: end,
    },
  });
};

export const getMySlotsService = async (doctorUserId) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorUserId },
  });

  if (!doctorProfile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  return await prisma.availabilitySlot.findMany({
    where: {
      doctorId: doctorProfile.id,
    },
    orderBy: [
      { slotDate: "asc" },
      { startTime: "asc" },
    ],
  });
};

export const updateSlotService = async (doctorUserId, slotId, data) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorUserId },
  });

  if (!doctorProfile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  const slot = await prisma.availabilitySlot.findFirst({
    where: {
      id: Number(slotId),
      doctorId: doctorProfile.id,
    },
  });

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (slot.status === "BOOKED") {
    throw new ApiError(400, "Cannot update a booked slot");
  }

  return await prisma.availabilitySlot.update({
    where: { id: Number(slotId) },
    data,
  });
};

export const deleteSlotService = async (doctorUserId, slotId) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: doctorUserId },
  });

  if (!doctorProfile) {
    throw new ApiError(404, "Doctor profile not found");
  }

  const slot = await prisma.availabilitySlot.findFirst({
    where: {
      id: Number(slotId),
      doctorId: doctorProfile.id,
    },
  });

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (slot.status === "BOOKED") {
    throw new ApiError(400, "Cannot delete a booked slot");
  }

  return await prisma.availabilitySlot.delete({
    where: { id: Number(slotId) },
  });
};