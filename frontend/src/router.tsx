import App from "@fe/App";
import LoginScreen from "@fe/components/auth/screens/LoginScreen/LoginScreen";
import SignUpScreen from "@fe/components/auth/screens/SignUpScreen/SignUpScreen";
import { CollectionScreen } from "@fe/components/collection/CollectionScreen";
import { ProfileScreen } from "@fe/components/profile/ProfileScreen";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/login', element: <LoginScreen />},
  {path: '/signup', element: <SignUpScreen />},
  {path: '/collection', element: <CollectionScreen />},
  {path: '/profile', element: <ProfileScreen />},
])