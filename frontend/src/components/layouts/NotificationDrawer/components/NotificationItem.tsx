import type { NotificationData } from "@fe/components/layouts/NotificationDrawer/types/NotificationType";
import { Card, Flex, Stack, Text } from "@chakra-ui/react";
import { UnreadCircle } from "@fe/components/layouts/NotificationDrawer/components/UnreadCircle";
import { NotificationThumbnail } from "@fe/components/layouts/NotificationDrawer/components/NotificationThumbnail";
import { decodeHtmlEntities } from "@fe/utils/stringUtils";

interface Props {
  notification: NotificationData;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: Props) {
  return (
    <Card.Root
      size="sm"
      flexShrink={0}
      cursor="pointer"
      onClick={onClick}
      bg={notification.isRead ? "transparent" : "rgba(216, 180, 173, 0.15)"}
      border="1px solid"
      borderColor={notification.isRead ? "transparent" : "rgba(216, 180, 173, 0.4)"}
      borderRadius="xl"
      _dark={{
        bg: notification.isRead ? "transparent" : "rgba(156, 111, 111, 0.15)",
        borderColor: notification.isRead ? "transparent" : "rgba(156, 111, 111, 0.4)"
      }}
      _hover={{ 
        bg: "white",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 20px rgba(196, 159, 152, 0.3)",
        borderColor: "transparent",
        _dark: {
          bg: "whiteAlpha.100",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          borderColor: "transparent"
        }
      }}
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      overflow="hidden"
      mb={1}
    >
      <Card.Body py={3} px={3}>
        <Flex gap={4} align="center" position="relative">
          <NotificationThumbnail image={notification.image} />

          <Stack gap={1} flex={1} pr={notification.isRead ? 0 : 5}>
            <Text 
              fontWeight={notification.isRead ? "medium" : "bold"} 
              fontSize="sm" 
              color={notification.isRead ? "fg.muted" : "fg"}
              _dark={{ color: notification.isRead ? "whiteAlpha.600" : "white" }}
              lineClamp={1}
            >
              {decodeHtmlEntities(notification.title)}
            </Text>
            <Text 
              fontSize="xs" 
              color="gray.500"
              _dark={{ color: "whiteAlpha.500" }}
              lineClamp={2} 
              lineHeight="1.4"
            >
              {decodeHtmlEntities(notification.message)}
            </Text>
          </Stack>

          {!notification.isRead && (
            <UnreadCircle 
              top="50%" 
              right="0px" 
              transform="translateY(-50%)" 
            />
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
