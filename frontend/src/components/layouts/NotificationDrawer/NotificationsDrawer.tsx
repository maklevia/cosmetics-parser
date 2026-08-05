import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";
import { useNotifications } from "@fe/components/layouts/NotificationDrawer/hooks/useNotifications";
import { BellTrigger } from "@fe/components/layouts/NotificationDrawer/components/BellTrigger";
import { NotificationsList } from "@fe/components/layouts/NotificationDrawer/components/NotificationsList";
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "@fe/components/ui/drawer";

export function NotificationsDrawer() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  const handleItemClick = async (
    productId: number | null,
    notifId: number,
    isRead: boolean,
  ) => {
    if (productId) {
      productsDialog.open("a", { mode: "delete", productId });
    }
    if (!isRead) {
      markAsRead(notifId);
    }
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <DrawerRoot placement="end">
      <DrawerTrigger asChild>
        <BellTrigger unreadCount={unreadCount} />
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerCloseTrigger />
        </DrawerHeader>

        <DrawerBody px={4} py={2} position="relative" display="flex" flexDir="column" overflowY="auto">
          <NotificationsList notifications={notifications} isLoading={isLoading} onItemClick={handleItemClick} />
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
}
