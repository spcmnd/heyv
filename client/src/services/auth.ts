export interface TokenCredentials {
  access?: string;
  refresh?: string;
}

const ACCESS_TOKEN_KEY = "heyv_access";
const REFRESH_TOKEN_KEY = "heyv_refresh";

class AuthService {
  private baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      throw new Error("API URL not provided.");
    }

    this.baseUrl = apiUrl;
  }

  public async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login/`, {
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

    return;
  }

  public async refresh(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error("Session expired.");
    }

    const { access, refresh } = await response.json();
    this.saveTokens(access, refresh);

    return;
  }

  public clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  public getTokensFromStorage() {
    return {
      access: localStorage.getItem(ACCESS_TOKEN_KEY),
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
  }

  private saveTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export default new AuthService();
