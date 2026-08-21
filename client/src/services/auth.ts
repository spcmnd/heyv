import { API_URL } from "./config.ts";

const ACCESS_TOKEN_KEY = "heyv_access";
const REFRESH_TOKEN_KEY = "heyv_refresh";

export interface TokenCredentials {
  access?: string | null;
  refresh?: string | null;
}

class AuthService {
  public async login(username: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login has failed.");
    }

    const { access, refresh } = await response.json();
    this.saveTokens(access, refresh);
  }

  public async refresh(refreshToken: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Session expired.");
    }

    const { access, refresh } = await response.json();

    if (access && refresh) {
      this.saveTokens(access, refresh);
    }
  }

  public clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public getTokensFromStorage(): TokenCredentials {
    return {
      access: localStorage.getItem(ACCESS_TOKEN_KEY),
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
  }

  private saveTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export default new AuthService();
