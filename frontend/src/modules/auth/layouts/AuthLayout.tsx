import { Box, Flex} from "@chakra-ui/react";
import { Logo } from "@fe/components/common/Logo";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
      <Box bg="surface.page" minH="100vh" w="100%" display="flex" alignItems="center" justifyContent="center">
        <Flex flexDirection='column' alignItems='center' gap={6}>
          <Logo fontSize='4xl' />

          <Box
            bg="surface.authCard"
            borderRadius="2xl"
            boxShadow={{ base: "0 4px 24px rgba(0,0,0,0.07)", _dark: "0 8px 32px rgba(1, 1, 1, 0.6)" }}
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
