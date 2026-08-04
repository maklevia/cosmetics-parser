import { Box, Center, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import React from "react";
import { LuBell } from "react-icons/lu";

interface Props {
  unreadCount: number;
}

export const BellTrigger = React.forwardRef<HTMLButtonElement, Props>(
  ({ unreadCount, ...rest }, ref) => {
    const bellColor = useColorModeValue("white", "rgb(156, 111, 111)");
    const bellHoverBg = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");
    const badgeBg = useColorModeValue("rgb(156, 111, 111)", "rgba(210, 170, 162, 1)");

    return (
      <Box position="relative">
        <IconButton
          variant="ghost"
          rounded="full"
          aria-label="Notifications"
          cursor="pointer"
          color={bellColor}
          _hover={{ bg: bellHoverBg }}
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
            bg={badgeBg}
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
