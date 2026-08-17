import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import authService from "../services/auth.ts";
import type { User } from "../domains/user/types/user.ts";
import { getUser } from "../domains/user/userService.ts";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const { access } = authService.getTokensFromStorage();

      if (access) {
        try {
          const user = await getUser("me");
          setUser(user);
        } catch {}
      }

      setLoading(false);
    };

    validateSession();
  }, []);

  const login = async (username: string, password: string) => {
    await authService.login(username, password);

    return;
  };

  const getCurrentUser = async () => {
    const user = await getUser("me");
    setUser(user);

    return;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth should be used inside an AuthProvider.");
  }

  return context;
};
