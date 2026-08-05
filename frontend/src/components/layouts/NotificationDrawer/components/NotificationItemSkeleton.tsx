import { Card, Flex, Stack, Box, Skeleton } from "@chakra-ui/react";

export function NotificationItemSkeleton() {
  return (
    <Card.Root
      size="sm"
      flexShrink={0}
      bg="transparent"
      border="1px solid"
      borderColor="transparent"
      borderRadius="xl"
      overflow="hidden"
      mb={1}
    >
      <Card.Body py={3} px={3}>
        <Flex gap={4} align="center">
          <Box flexShrink={0}>
            <Skeleton boxSize="44px" borderRadius="lg" />
          </Box>

          <Stack gap={1} flex={1}>
            <Skeleton height="14px" width="70%" borderRadius="sm" />
            <Skeleton height="12px" width="90%" borderRadius="sm" />
          </Stack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
