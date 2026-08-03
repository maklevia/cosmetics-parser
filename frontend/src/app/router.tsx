import { AuthProvider } from "@fe/modules/auth/hooks/useAuth";
import LoginScreen from "@fe/modules/auth/screens/LoginScreen";
import SignUpScreen from "@fe/modules/auth/screens/SignUpScreen";
import { CollectionScreen } from "@fe/modules/collection/CollectionScreen";
import { ProfileScreen } from "@fe/modules/profile/ProfileScreen";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { path: "/", element: <CollectionScreen /> },
      { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignUpScreen /> },
      { path: "/profile", element: <ProfileScreen /> },
    ],
  },
]);
