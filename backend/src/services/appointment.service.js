import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { emitToUser } from "../config/socket.js";
import {
  sendBookingConfirmationEmail,
  sendCancellationEmail,
} from "./email.service.js";

/**
 * Fetch all available slots belonging to a doctor.
 */
export const getAvailableSlotsService = async (doctorUserId) => {
  const doctor = await prisma.user.findFirst({
    where: {
      id: Number(doctorUserId),
      role: "DOCTOR",
      isActive: true,
    },
    include: {
      doctorProfile: true,
    },
  });

  if (!doctor || !doctor.doctorProfile) {
    throw new ApiError(404, "Doctor not found");
  }

  return prisma.availabilitySlot.findMany({
    where: {
      doctorId: doctor.doctorProfile.id,
      status: "AVAILABLE",
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

/**
 * Book an available appointment slot.
 */
export const bookAppointmentService = async (patientId, data) => {
  const { slotId, reason, type, notes } = data;

  if (!slotId) {
    throw new ApiError(400, "Slot ID is required");
  }

  const slot = await prisma.availabilitySlot.findUnique({
    where: {
      id: Number(slotId),
    },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (slot.status !== "AVAILABLE") {
    throw new ApiError(409, "Slot is already booked or unavailable");
  }

  if (slot.startTime < new Date()) {
    throw new ApiError(400, "Past appointment slots cannot be booked");
  }

  const result = await prisma.$transaction(async (tx) => {
    /*
     * Atomically change the slot from AVAILABLE to BOOKED.
     * This prevents two patients from booking it simultaneously.
     */
    const slotUpdate = await tx.availabilitySlot.updateMany({
      where: {
        id: slot.id,
        status: "AVAILABLE",
      },
      data: {
        status: "BOOKED",
      },
    });

    if (slotUpdate.count === 0) {
      throw new ApiError(409, "Slot was just booked by another patient");
    }

    const createdAppointment = await tx.appointment.create({
      data: {
        patientId,
        doctorId: slot.doctor.userId,
        slotId: slot.id,
        reason,
        type: type || "OFFLINE",
        notes,
        status: "CONFIRMED",
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: patientId,
        appointmentId: createdAppointment.id,
        type: "BOOKING_CONFIRMATION",
        channel: "EMAIL",
        title: "Appointment Confirmed",
        message: `Your appointment with ${slot.doctor.user.name} has been booked successfully.`,
        priority: "NORMAL",
      },
    });

    return {
      appointmentId: createdAppointment.id,
      notification,
    };
  });

  // Emit events only after the transaction succeeds.
  emitToUser(patientId, "notification:new", result.notification);

  emitToUser(slot.doctor.userId, "appointment:new", {
    appointmentId: result.appointmentId,
    patientId,
    slotId: slot.id,
  });

  // Fetch fresh data so the returned slot status is BOOKED.
  const freshAppointment = await prisma.appointment.findUnique({
    where: {
      id: result.appointmentId,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      slot: true,
    },
  });

  if (!freshAppointment) {
    throw new ApiError(500, "Appointment was created but could not be retrieved");
  }

  /*
   * Send the email without blocking or failing the appointment API.
   * sentAt is updated only when email delivery succeeds.
   */
  sendBookingConfirmationEmail({
    patientEmail: freshAppointment.patient.email,
    patientName: freshAppointment.patient.name,
    doctorName: freshAppointment.doctor.name,
    slot: freshAppointment.slot,
  })
    .then(async () => {
      await prisma.notification.update({
        where: {
          id: result.notification.id,
        },
        data: {
          sentAt: new Date(),
        },
      });

      console.log(
        `Booking confirmation email sent to ${freshAppointment.patient.email}`
      );
    })
    .catch((error) => {
      console.error("Booking confirmation email failed:", error.message);
    });

  return freshAppointment;
};

/**
 * Return appointments according to the authenticated user's role.
 */
export const getMyAppointmentsService = async (user) => {
  let whereCondition;

  if (user.role === "PATIENT") {
    whereCondition = {
      patientId: user.id,
    };
  } else if (user.role === "DOCTOR") {
    whereCondition = {
      doctorId: user.id,
    };
  } else if (user.role === "ADMIN") {
    whereCondition = {};
  } else {
    throw new ApiError(403, "Invalid user role");
  }

  return prisma.appointment.findMany({
    where: whereCondition,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      slot: true,
      notifications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Cancel an appointment and release its booked slot.
 */
export const cancelAppointmentService = async (
  user,
  appointmentId,
  cancelReason
) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: Number(appointmentId),
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (user.role === "PATIENT" && appointment.patientId !== user.id) {
    throw new ApiError(403, "You can cancel only your own appointment");
  }

  if (user.role === "DOCTOR" && appointment.doctorId !== user.id) {
    throw new ApiError(403, "You can cancel only your own appointment");
  }

  if (!["PATIENT", "DOCTOR", "ADMIN"].includes(user.role)) {
    throw new ApiError(403, "You are not allowed to cancel appointments");
  }

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "Appointment is already cancelled");
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(400, "A completed appointment cannot be cancelled");
  }

  if (appointment.status === "NO_SHOW") {
    throw new ApiError(400, "A no-show appointment cannot be cancelled");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedAppointment = await tx.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        status: "CANCELLED",
        cancelReason: cancelReason || "No reason provided",
      },
    });

    await tx.availabilitySlot.update({
      where: {
        id: appointment.slotId,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: appointment.patientId,
        appointmentId: appointment.id,
        type: "CANCELLATION",
        channel: "EMAIL",
        title: "Appointment Cancelled",
        message: cancelReason
          ? `Your appointment was cancelled. Reason: ${cancelReason}`
          : "Your appointment was cancelled.",
        priority: "HIGH",
      },
    });

    return {
      appointmentId: updatedAppointment.id,
      notification,
    };
  });

  emitToUser(
    appointment.patientId,
    "notification:new",
    result.notification
  );

  emitToUser(appointment.doctorId, "appointment:cancelled", {
    appointmentId: result.appointmentId,
    cancelReason: cancelReason || "No reason provided",
  });

  // Fetch fresh data so the returned slot status is AVAILABLE.
  const freshAppointment = await prisma.appointment.findUnique({
    where: {
      id: result.appointmentId,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      slot: true,
    },
  });

  if (!freshAppointment) {
    throw new ApiError(
      500,
      "Appointment was cancelled but could not be retrieved"
    );
  }

  sendCancellationEmail({
    patientEmail: freshAppointment.patient.email,
    patientName: freshAppointment.patient.name,
    doctorName: freshAppointment.doctor.name,
    cancelReason: cancelReason || "No reason provided",
  })
    .then(async () => {
      await prisma.notification.update({
        where: {
          id: result.notification.id,
        },
        data: {
          sentAt: new Date(),
        },
      });

      console.log(
        `Cancellation email sent to ${freshAppointment.patient.email}`
      );
    })
    .catch((error) => {
      console.error("Cancellation email failed:", error.message);
    });

  return freshAppointment;
};

/**
 * Allow a doctor to change the status of their appointment.
 */
export const updateAppointmentStatusService = async (
  doctorId,
  appointmentId,
  status
) => {
  const allowedStatuses = ["CONFIRMED", "COMPLETED", "NO_SHOW"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${allowedStatuses.join(", ")}`
    );
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: Number(appointmentId),
    },
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.doctorId !== doctorId) {
    throw new ApiError(403, "You can update only your own appointments");
  }

  if (appointment.status === "CANCELLED") {
    throw new ApiError(400, "A cancelled appointment cannot be updated");
  }

  if (appointment.status === "COMPLETED") {
    throw new ApiError(400, "The appointment is already completed");
  }

  return prisma.appointment.update({
    where: {
      id: Number(appointmentId),
    },
    data: {
      status,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      slot: true,
    },
  });
};

/**
 * Return appointment statistics for the authenticated doctor.
 */
export const getDoctorStatsService = async (doctorId) => {
  const [
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    upcomingAppointments,
  ] = await prisma.$transaction([
    prisma.appointment.count({
      where: {
        doctorId,
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId,
        status: "COMPLETED",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId,
        status: "CANCELLED",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId,
        status: "NO_SHOW",
      },
    }),

    prisma.appointment.count({
      where: {
        doctorId,
        status: "CONFIRMED",
        slot: {
          startTime: {
            gte: new Date(),
          },
        },
      },
    }),
  ]);

  return {
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    upcomingAppointments,
  };
};