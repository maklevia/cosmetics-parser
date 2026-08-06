import { Box, Flex, } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@fe/components/common/Logo";
import { ProfileButton } from "@fe/components/layouts/Header/components/ProfileButton";
import { NotificationsDrawer } from "@fe/components/layouts/NotificationDrawer/NotificationsDrawer";

export function Header() {
    const navigator = useNavigate();

  return (
    <Box 
      as="header" 
      bg="surface.header" 
      borderBottom="1px solid" 
      borderColor="blackAlpha.100"
      _dark={{ 
        borderColor: "whiteAlpha.50" 
      }}
    >
      <Flex h="70px" px={8} alignItems="center" justifyContent="space-between">
        
        <Logo fontSize="3xl" onLogoClick={() => navigator('/')}/>

        <Flex gap={4} alignItems="center">
          <NotificationsDrawer />
          <ProfileButton />
        </Flex>

      </Flex>
    </Box>
  );
}
