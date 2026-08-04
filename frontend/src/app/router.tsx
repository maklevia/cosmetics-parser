import { AuthProvider } from "@fe/modules/auth/hooks/useAuth";
import LoginScreen from "@fe/modules/auth/screens/LoginScreen";
import SignUpScreen from "@fe/modules/auth/screens/SignUpScreen";
import { CollectionScreen } from "@fe/modules/collection/CollectionScreen";
import { ProfileScreen } from "@fe/modules/profile/ProfileScreen";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout } from "@fe/components/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <CollectionScreen /> },
          { path: "/profile", element: <ProfileScreen /> },
        ]
      },
      { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignUpScreen /> },
    ],
  },
]);
