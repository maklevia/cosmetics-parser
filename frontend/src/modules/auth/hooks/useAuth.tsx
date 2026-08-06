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

  const fetchUser = useCallback(async (isIgnored?: () => boolean) => {
    try {
      const response = await api.get<UserInfo>("/user/profile");
      if (isIgnored && isIgnored()) return;
      setUser(response.data);
    } catch {
      if (isIgnored && isIgnored()) return;
      setUser(null);
    } finally {
      if (!isIgnored || !isIgnored()) {
        setIsLoading(false);
      }
    }
  }, []);

  const reloadUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    let ignore = false;
    
    const init = async () => {
      await fetchUser(() => ignore);
    };
    init();

    return () => {
      ignore = true;
    };
  }, [fetchUser]);

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
