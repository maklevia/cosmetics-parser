import { useState } from "react";

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: { name: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement profile update logic here
      console.log("Update profile triggered with", data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
}
