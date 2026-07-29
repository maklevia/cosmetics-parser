import type { NotificationData } from "@fe/components/collection/screens/NotificationDashboard/types/NotificationType";
import { Box, Card, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FiTag } from "react-icons/fi";
import { UnreadCircle } from "@fe/components/collection/screens/NotificationDashboard/components/UnreadCircle";

interface Props {
  notification: NotificationData;
  onClick: (productId: number | null) => void;
}

export function NotificationItem({ notification, onClick }: Props) {
  return (
    <Card.Root
      size="sm"
      cursor="pointer"
      onClick={() => onClick(notification.productId)}
      _hover={{ bg: "bg.muted" }}
      transition="background 0.2s"
    >
      <Card.Body>
        <Flex gap={3} align="flex-start" position="relative">
          <Box flexShrink={0}>
            {notification.image ? (
              <Image
                src={notification.image}
                alt="Product Image"
                boxSize="48px"
                objectFit="cover"
                borderRadius="md"
              />
            ) : (
              <Flex
                boxSize="48px"
                bg="bg.muted"
                borderRadius="md"
                align="center"
                justify="center"
                color="fg.muted"
              >
                <FiTag size={20} />
              </Flex>
            )}
          </Box>

          <Stack gap={0.5} flex={1}>
            <Text fontWeight="semibold" fontSize="sm" lineClamp={1}>
              {notification.title}
            </Text>
            <Text fontSize="xs" color="fg.muted" lineClamp={2}>
              {notification.message}
            </Text>
          </Stack>

          {/* Unread dot */}
          {!notification.isRead && (
            <UnreadCircle />
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
