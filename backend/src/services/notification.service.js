import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

export const getMyNotificationsService = async (userId, query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const where = {
    userId,
  };

  if (query.isRead === "true") {
    where.isRead = true;
  }

  if (query.isRead === "false") {
    where.isRead = false;
  }

  const [notifications, total, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
              },
            },
            slot: true,
          },
        },
      },
    }),

    prisma.notification.count({ where }),

    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadCountService = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};

export const markNotificationReadService = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      userId,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return prisma.notification.update({
    where: {
      id: notification.id,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsReadService = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return {
    updatedCount: result.count,
  };
};

export const deleteNotificationService = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: Number(notificationId),
      userId,
    },
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  await prisma.notification.delete({
    where: {
      id: notification.id,
    },
  });
};