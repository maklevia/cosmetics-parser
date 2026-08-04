import { api } from "@fe/config/api";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { reloadUser } = useAuth();

  const updateProfile = async (data: { newName: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.patch('/user/updateName', { newName: data.newName });
      await reloadUser();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to update profile");
      } else {
        setError("Something went wrong. Please try again later.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
}
