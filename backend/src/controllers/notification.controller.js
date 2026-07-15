import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getMyNotificationsService,
  getUnreadCountService,
  markNotificationReadService,
  markAllNotificationsReadService,
  deleteNotificationService,
} from "../services/notification.service.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await getMyNotificationsService(req.user.id, req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Notifications fetched successfully", result));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadCountService(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Unread notification count fetched successfully", {
      unreadCount,
    })
  );
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationReadService(
    req.user.id,
    req.params.id
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsReadService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read", result));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await deleteNotificationService(req.user.id, req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted successfully"));
});