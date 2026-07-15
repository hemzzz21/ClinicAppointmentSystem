import prisma from "../config/prisma.js";

export const getAdminDashboardService = async () => {
  const totalPatients = await prisma.user.count({
    where: { role: "PATIENT" },
  });

  const totalDoctors = await prisma.user.count({
    where: { role: "DOCTOR" },
  });

  const totalAppointments = await prisma.appointment.count();

  const confirmedAppointments = await prisma.appointment.count({
    where: { status: "CONFIRMED" },
  });

  const completedAppointments = await prisma.appointment.count({
    where: { status: "COMPLETED" },
  });

  const cancelledAppointments = await prisma.appointment.count({
    where: { status: "CANCELLED" },
  });

  const noShowAppointments = await prisma.appointment.count({
    where: { status: "NO_SHOW" },
  });

  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      patient: {
        select: { id: true, name: true, email: true, phone: true },
      },
      doctor: {
        select: { id: true, name: true, email: true, phone: true },
      },
      slot: true,
    },
  });

  return {
    totalPatients,
    totalDoctors,
    totalAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    recentAppointments,
  };
};

export const getAllUsersService = async (query) => {
  const {
    search = "",
    role,
    page = 1,
    limit = 10,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  if (role) {
    where.role = role;
  }

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

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getAllAppointmentsService = async () => {
  return await prisma.appointment.findMany({
    include: {
      patient: {
        select: { id: true, name: true, email: true, phone: true },
      },
      doctor: {
        select: { id: true, name: true, email: true, phone: true },
      },
      slot: true,
      notifications: true,
    },
    orderBy: { createdAt: "desc" },
  });
};