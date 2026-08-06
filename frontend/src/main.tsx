import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@fe/components/ui/provider.tsx";
import { ToasterProvider } from "@fe/components/ui/toaster.tsx";
import { router } from "@fe/app/router.tsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@fe/modules/auth/hooks/useAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ToasterProvider />
    </Provider>
  </StrictMode>
);
