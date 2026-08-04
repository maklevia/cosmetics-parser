import { Box, Flex} from "@chakra-ui/react";
import { Logo } from "@fe/components/common/Logo";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pageBg = useColorModeValue(
    "radial-gradient(circle, rgba(233, 216, 219, 1) 77%, rgba(199, 169, 174, 1) 100%)", 
    "radial-gradient(circle,rgba(66, 44, 44, 1) 16%, rgba(38, 26, 22, 1) 100%) "
  );
  const cardBg = useColorModeValue("#faf8f7", "#2A1D1D");
  const cardShadow = useColorModeValue(
    "0 4px 24px rgba(0,0,0,0.07)",
    "0 8px 32px rgba(1, 1, 1, 0.6)"
  );

  return (
      <Box bg={pageBg} minH="100vh" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Flex flexDirection='column' alignItems='center' gap={6}>
          <Logo fontSize='4xl' />

          <Box
            bg={cardBg}
            borderRadius="2xl"
            boxShadow={cardShadow}
            px={10}
            py={10}
            w="100%"
            maxW="440px"
          >
            {children}
          </Box>
        </Flex>
      </Box>
  );
}
