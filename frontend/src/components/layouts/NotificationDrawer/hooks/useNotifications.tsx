import { api } from "@fe/config/api";
import type { NotificationData } from "@fe/components/layouts/NotificationDrawer/types/NotificationType";
import type { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface HookOutput {
  notifications: NotificationData[];
  markAsRead: (notifId: number) => void;
}
interface NotifResponse extends AxiosResponse {
    notifications: NotificationData[];
}

export function useNotifications(): HookOutput {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await api.get<NotifResponse>(
          "/notification/getAll",
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.log("FE: Error getting notifications: ", error);
      }
    };
    getNotifications();
  }, []);

  const markAsRead = async (notifId: number) => {
    try {
      setNotifications((prev) =>
      prev.map((notif) => (notif.notifId === notifId ? { ...notif, isRead: true } : notif))
    );

      await api.patch(`/notification/${notifId}/markAsRead`);
    } catch (error) {
      console.log('FE: error marking notification as read: ', error);
    }
  }

  return { notifications, markAsRead };
}
