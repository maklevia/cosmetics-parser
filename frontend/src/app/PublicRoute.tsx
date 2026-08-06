import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="rgb(156, 111, 111)" />
      </Center>
    );
  }

  if(isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
