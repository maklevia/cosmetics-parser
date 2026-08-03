import {api} from "@fe/config/api";
import { useState } from "react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";

interface HookInput {
  email: string;
  password: string;
  onSuccess: () => void;
}
interface HookOutput {
  isLoading: boolean;
  login: () => Promise<void>;
  errorMessage: string;
  clearErrors: () => void;
}
export const useLogin = (options: HookInput): HookOutput => {
  const { email, password, onSuccess } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { reloadUser } = useAuth();

  const clearErrors = () => setErrorMessage("");

  const login = async () => {
    setErrorMessage("");
    try {
      setIsLoading(true);
      const response = await api.post(
        "/auth/login",
        {
          email: email,
          enteredPassword: password,
        },
        {
          validateStatus: (status: number) => {
            return status === 401 || status === 200;
          },
        },
      );

      if (response.status === 401) {
        setErrorMessage("Email or password are not correct!");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      await reloadUser();
      onSuccess();
    } catch (error) {
      console.log("FE: error while user log in: ", error);
      setIsLoading(false);
    }
  };

  return { isLoading, login, errorMessage, clearErrors };
};
