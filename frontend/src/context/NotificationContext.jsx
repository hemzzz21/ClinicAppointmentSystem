import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket.service";
import { getUnreadNotificationCount } from "../services/notification.service";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const listenersRef = useRef(false);

  const refreshUnread = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      // silent - dashboard will surface errors
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setUnreadCount(0);
      return;
    }

    refreshUnread();

    connectSocket(token);
    const socket = getSocket();

    const handleNew = () => setUnreadCount((c) => c + 1);
    socket.on("notification:new", handleNew);

    listenersRef.current = true;

    return () => {
      if (listenersRef.current) {
        socket.off("notification:new", handleNew);
        listenersRef.current = false;
      }
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const value = {
    unreadCount,
    setUnreadCount,
    refreshUnread,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return ctx;
}
