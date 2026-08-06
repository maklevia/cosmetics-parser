import LoginScreen from "@fe/modules/auth/screens/LoginScreen";
import SignUpScreen from "@fe/modules/auth/screens/SignUpScreen";
import { CollectionScreen } from "@fe/modules/collection/CollectionScreen";
import { ProfileScreen } from "@fe/modules/profile/ProfileScreen";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { MainLayout } from "@fe/components/layouts/MainLayout";
import { CollectionProvider } from "@fe/modules/collection/context/CollectionProvider";
import { ProtectedRoute } from "@fe/app/ProtectedRoute";
import { PublicRoute } from "@fe/app/PublicRoute";
import { RootErrorBoundary } from "@fe/app/RootErrorBoundary";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <CollectionProvider>
                <MainLayout />
              </CollectionProvider>
            ),
            children: [
              { path: "/", element: <CollectionScreen /> },
              { path: "/profile", element: <ProfileScreen /> },
            ],
          },
        ],
      },
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <LoginScreen /> },
          { path: "/signup", element: <SignUpScreen /> },
        ],
      },
    ],
  },
]);
