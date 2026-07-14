import {api} from "@/api";
import { useState } from "react";

interface HookInput {
  email: string;
  password: string;
  onSuccess: () => void;
}

interface HookOutput {
  register: () => Promise<void>;
  isLoading: boolean;
}

export const useRegistration = (options: HookInput): HookOutput => {
  const { email, password, onSuccess } = options;
  const [isLoading, setIsLoading] = useState(false);
  const register = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(
        "/auth/signup",
        {
          email: email,
          password: password,
        },
        {
          validateStatus: (status) => {
            return status === 201 || status === 409;
          },
        },
      );

      if (response.status === 201) {
        onSuccess();
      } else if (response.status === 409) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("FE: error sign up ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
