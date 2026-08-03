import { productDetailsDialog } from "@fe/modules/collection/screens/CollectionArea/components/ProductDetailsDialog";
import { NotificationItem } from "@fe/modules/collection/screens/NotificationDashboard/components/NotificationItem";
import { useNotifications } from "@fe/modules/collection/screens/NotificationDashboard/hooks/useNotifications";
import { Box, ScrollArea, Text, VStack } from "@chakra-ui/react";

export function NotificationDashboard() {
  const { notifications, markAsRead } = useNotifications();

  const onClick = async (
    productId: number | null,
    notifId: number,
    isRead: boolean,
  ) => {
    if (productId) {
      productDetailsDialog.open("a", { productId });
    }
    if (!isRead) {
      markAsRead(notifId);
    }
  };

  return (
    <Box>
      <Text fontWeight="bold" fontSize="lg" mb={3}>
        Notifications
      </Text>

      <ScrollArea.Root maxHeight="400px">
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            {notifications?.length > 0 ? (
              <VStack gap={2} align="stretch">
                {notifications.map((notif) => (
                  <NotificationItem
                    notification={notif}
                    key={notif.notifId}
                    onClick={() =>
                      onClick(notif.productId, notif.notifId, notif.isRead)
                    }
                  />
                ))}
              </VStack>
            ) : (
              <Text fontSize="sm" color="fg.muted">
                No notifications yet
              </Text>
            )}
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Box>
  );
}
