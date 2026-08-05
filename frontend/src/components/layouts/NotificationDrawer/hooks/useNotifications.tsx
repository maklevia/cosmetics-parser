import { api } from "@fe/config/api";
import type { NotificationData } from "@fe/components/layouts/NotificationDrawer/types/NotificationType";
import type { AxiosResponse } from "axios";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toaster } from "@fe/components/ui/toaster";

interface HookOutput {
  notifications: NotificationData[];
  isLoading: boolean;
  markAsRead: (notifId: number) => void;
}
interface NotifResponse extends AxiosResponse {
    notifications: NotificationData[];
}

export function useNotifications(): HookOutput {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<NotifResponse>(
          "/notification/getAll",
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        if (isAxiosError(error) && error.response && error.response.status < 500) {
          toaster.error({ title: "Failed to load notifications" });
        }
      } finally {
        setIsLoading(false);
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
      if (isAxiosError(error) && error.response && error.response.status < 500) {
        toaster.error({ title: "Failed to update notification" });
      }
    }
  }

  return { notifications, isLoading, markAsRead };
}


