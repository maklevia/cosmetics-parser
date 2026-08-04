import { api } from "@fe/config/api";
import type { UserInfo } from "@fe/types/UserTypes";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get<UserInfo>("/user/profile");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reloadUser = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    let ignore = false;
    const loadInitialUser = async () => {
      try {
        const response = await api.get<UserInfo>("/user/profile");
        if (!ignore) {
          setUser(response.data);
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };
    loadInitialUser();

    return () => {
      ignore = true;
    };
  }, []);

  //logout implementation needed

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
