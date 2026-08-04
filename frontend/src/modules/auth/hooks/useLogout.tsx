import { useState } from "react";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement logout logic here
      console.log("Logout triggered");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}
