import { createContext, useContext, useState, type ReactNode } from "react";

import authService from "../services/auth.ts";
import type { User } from "../domains/user/types/user.ts";
import { getUser } from "../domains/user/userService.ts";

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
    <AuthContext.Provider value={{ user, login, getCurrentUser }}>
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
