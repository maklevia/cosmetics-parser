import type { NotificationData } from "@fe/components/layouts/NotificationDrawer/types/NotificationType";
import { Card, Flex, Stack, Text } from "@chakra-ui/react";
import { UnreadCircle } from "@fe/components/layouts/NotificationDrawer/components/UnreadCircle";
import { NotificationThumbnail } from "@fe/components/layouts/NotificationDrawer/components/NotificationThumbnail";
import { useColorModeValue } from "@fe/components/ui/color-mode";

interface Props {
  notification: NotificationData;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: Props) {
  const unreadBg = useColorModeValue("rgba(216, 180, 173, 0.15)", "rgba(156, 111, 111, 0.15)");
  const readBg = useColorModeValue("transparent", "transparent");
  const hoverBg = useColorModeValue("white", "whiteAlpha.100");
  const hoverShadow = useColorModeValue(
    "0 4px 20px rgba(196, 159, 152, 0.3)",
    "0 4px 20px rgba(0, 0, 0, 0.5)"
  );
  const unreadBorderColor = useColorModeValue("rgba(216, 180, 173, 0.4)", "rgba(156, 111, 111, 0.4)");

  const titleColor = useColorModeValue(
    notification.isRead ? "fg.muted" : "fg", 
    notification.isRead ? "whiteAlpha.600" : "white"
  );
  
  const messageColor = useColorModeValue("gray.500", "whiteAlpha.500");

  return (
    <Card.Root
      size="sm"
      flexShrink={0}
      cursor="pointer"
      onClick={onClick}
      bg={notification.isRead ? readBg : unreadBg}
      border="1px solid"
      borderColor={notification.isRead ? "transparent" : unreadBorderColor}
      borderRadius="xl"
      _hover={{ 
        bg: hoverBg,
        transform: "translateY(-2px)",
        boxShadow: hoverShadow,
        borderColor: "transparent"
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
              color={titleColor}
              lineClamp={1}
            >
              {notification.title}
            </Text>
            <Text 
              fontSize="xs" 
              color={messageColor} 
              lineClamp={2} 
              lineHeight="1.4"
            >
              {notification.message}
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
