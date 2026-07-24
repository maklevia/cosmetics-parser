import App from "@/App";
import LoginScreen from "@/components/auth/screens/LoginScreen/LoginScreen";
import SignUpScreen from "@/components/auth/screens/SignUpScreen/SignUpScreen";
import { CollectionScreen } from "@/components/collection/CollectionScreen";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/login', element: <LoginScreen />},
  {path: '/signup', element: <SignUpScreen />},
  {path: '/collection', element: <CollectionScreen />}
])