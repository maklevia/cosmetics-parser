import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { Header } from "@fe/components/layouts/Header/Header";

export function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  
  const title = is404 ? "404 - Page Not Found" : "Oops! Something went wrong";
  const message = is404 
    ? "The page you are looking for doesn't exist or has been moved."
    : "An unexpected error occurred in the application.";

  return (
    <Box bg="surface.page" minH="100vh" w="100%">
      <Header />
      <VStack justify="center" h="calc(100vh - 72px)" gap={6} px={6} textAlign="center">
        <Heading size="3xl" color="brand.text" _dark={{ color: "white" }}>
          {title}
        </Heading>
        <Text fontSize="lg" color="fg.muted" maxW="md">
          {message}
        </Text>
        <Button 
          size="lg" 
          bg="brand.solid" 
          color="white" 
          _hover={{ bg: "brand.hover" }}
          onClick={() => navigate("/")}
        >
          Go back to Collection
        </Button>
      </VStack>
    </Box>
  );
}
