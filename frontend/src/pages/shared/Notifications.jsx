import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";

import { useNotifications } from "../../context/useNotifications";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notification.service";
import { formatDateTime } from "../../utils/format";

function NotificationsPage({ role }) {
  const { unreadCount, refreshUnread } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ page: 1, limit: 50 });
      setNotifications(res.data?.notifications || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      refreshUnread();
    } catch {
      toast.error("Could not mark as read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      refreshUnread();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Could not mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      refreshUnread();
      toast.success("Notification deleted");
    } catch {
      toast.error("Could not delete notification");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow={`${role} notifications`}
        title="Notifications"
        subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : "You're all caught up."}
        action={
          unreadCount > 0 && (
            <Button variant="secondary" onClick={handleMarkAll}>
              <CheckCheck size={16} />
              Mark all read
            </Button>
          )
        }
      />

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Booking confirmations and reminders will show up here."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <article
              key={n.id}
              className={`flex items-start justify-between gap-4 rounded-3xl border p-5 shadow-sm backdrop-blur transition ${
                n.isRead
                  ? "border-white/70 bg-white/60"
                  : "border-[#457D58]/20 bg-[#eef7f1]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6f2e9] text-[#457D58]">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-900">{n.title}</h4>
                    <Badge status={n.priority} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#457D58]"
                    title="Mark as read"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default NotificationsPage;
