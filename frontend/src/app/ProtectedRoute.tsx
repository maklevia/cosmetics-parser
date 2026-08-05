import { Center, Spinner } from "@chakra-ui/react"
import { useAuth } from "@fe/modules/auth/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const {isLoading, isAuthenticated } = useAuth()

    if (isLoading) {
        return (
            <Center h='100vh'>
                <Spinner size="xl" color="brand.text"/>
            </Center>
        )
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace/>
        )
    }

    return <Outlet />;
}
