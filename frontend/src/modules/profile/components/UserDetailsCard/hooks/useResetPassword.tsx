import { useState } from "react";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement reset password logic here
      console.log("Reset password triggered", { oldPassword, newPassword });
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to reset password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
}
