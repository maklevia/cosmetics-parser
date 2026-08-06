import type { NotificationData } from "@fe/components/layouts/NotificationDrawer/types/NotificationType";
import { Center, Text, VStack } from "@chakra-ui/react";
import { NotificationItem } from "./NotificationItem";
import { NotificationItemSkeleton } from "./NotificationItemSkeleton";

interface Props {
  notifications: NotificationData[];
  isLoading: boolean;
  onItemClick: (productId: number | null, notifId: number, isRead: boolean) => void;
}

export function NotificationsList({ notifications, isLoading, onItemClick }: Props) {
  if (isLoading) {
    return (
      <VStack gap={2} align="stretch" flex="1">
        {Array.from({ length: 4 }).map((_, i) => (
          <NotificationItemSkeleton key={i} />
        ))}
      </VStack>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Center h="100%">
        <Text fontSize="sm" color="fg.muted">
          No notifications yet
        </Text>
      </Center>
    );
  }

  return (
    <VStack gap={2} align="stretch" flex="1" overflowY="auto">
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.notifId}
          notification={notif}
          onClick={() => onItemClick(notif.productId, notif.notifId, notif.isRead)}
        />
      ))}
    </VStack>
  );
}

