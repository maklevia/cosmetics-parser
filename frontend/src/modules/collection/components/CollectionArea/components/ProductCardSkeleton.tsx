import { Card, Stack, Box, Skeleton } from "@chakra-ui/react";

export function ProductCardSkeleton() {
  return (
    <Card.Root
      w="100%"
      h="100%"
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      _dark={{ bg: "#2F2121", borderColor: "whiteAlpha.100" }}
      borderRadius="2xl"
      overflow="hidden"
    >
      <Card.Body padding="5">
        <Stack gap="4" align="center" h="100%">
          <Box height="140px" display="flex" alignItems="center" justifyContent="center" w="100%">
            <Skeleton height="120px" width="100px" borderRadius="md" />
          </Box>

          <Stack gap="1" width="100%" textAlign="center" mt="auto" align="center">
            <Skeleton height="12px" width="60%" borderRadius="sm" />
            <Skeleton height="14px" width="85%" borderRadius="sm" />
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
