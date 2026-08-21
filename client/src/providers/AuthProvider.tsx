import { useEffect, useState, type ReactNode } from "react";

import authService from "../services/auth.ts";
import { UNAUTHORIZED_EVENT } from "../services/config.ts";
import type { User } from "../domains/user/types/user.ts";
import { getUser } from "../domains/user/userService.ts";
import { AuthContext } from "./authContext.ts";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const { access } = authService.getTokensFromStorage();

      if (access) {
        try {
          setUser(await getUser("me"));
        } catch {}
      }

      setLoading(false);
    };

    validateSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = async (username: string, password: string) => {
    await authService.login(username, password);
    setUser(await getUser("me"));
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};
