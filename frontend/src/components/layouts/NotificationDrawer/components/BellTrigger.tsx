import { Box, Center, IconButton } from "@chakra-ui/react";
import React from "react";
import { LuBell } from "react-icons/lu";

interface Props {
  unreadCount: number;
}

export const BellTrigger = React.forwardRef<HTMLButtonElement, Props>(
  ({ unreadCount, ...rest }, ref) => {

    return (
      <Box position="relative">
        <IconButton
          variant="ghost"
          rounded="full"
          aria-label="Notifications"
          cursor="pointer"
          color={{ base: "white", _dark: "brand.text" }}
          _hover={{ bg: { base: "whiteAlpha.200", _dark: "whiteAlpha.100" } }}
          ref={ref}
          {...rest}
        >
          <LuBell size={20} />
        </IconButton>
        {unreadCount > 0 && (
          <Center
            position="absolute"
            top={0}
            right={0}
            boxSize="18px"
            bg={{ base: "brand.text", _dark: "brand.muted" }}
            color="white"
            borderRadius="full"
            fontSize="10px"
            fontWeight="bold"
            pointerEvents="none"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Center>
        )}
      </Box>
    );
  }
);
