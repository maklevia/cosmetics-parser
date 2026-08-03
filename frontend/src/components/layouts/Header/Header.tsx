import { Box, Flex, } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@fe/components/common/Logo";
import { ProfileButton } from "@fe/components/layouts/Header/components/ProfileButton";

export function Header() {
    const navigator = useNavigate();

  return (
    <Box 
      as="header" 
      bg="rgb(216, 180, 173)" 
      borderBottom="1px solid" 
      borderColor="blackAlpha.100"
      _dark={{ 
        bg: "#1F1515", 
        borderColor: "whiteAlpha.50" 
      }}
    >
      <Flex h="70px" px={8} alignItems="center" justifyContent="space-between">
        
        <Logo fontSize="3xl" onLogoClick={() => navigator('/')}/>

        <Box>
         <ProfileButton />
        </Box>

      </Flex>
    </Box>
  );
}
