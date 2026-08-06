import { api } from "@fe/config/api";
import { useState, useCallback } from "react";
import { toaster } from "@fe/components/ui/toaster";
import { isAxiosError } from "axios";

interface HookInput {
  onSuccess: () => void;
}

interface HookOutput {
  register: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const useRegistration = (options: HookInput): HookOutput => {
  const { onSuccess } = options;
  const [isLoading, setIsLoading] = useState(false);
  const register = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await api.post("/auth/signup", {
        email,
        password,
      });
      onSuccess();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toaster.error({ title: "User with this email already exists" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  return { register, isLoading };
};
