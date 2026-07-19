export interface TokenCredentials {
  access?: string;
  refresh?: string;
}

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
      // TODO: Redirect to login.
      throw new Error("Session expired.");
    }

    const { access, refresh } = await response.json();
    this.saveTokens(access, refresh);

    return;
  }

  public getTokensFromStorage() {
    return {
      access: localStorage.getItem("heyv_access"),
      refresh: localStorage.getItem("heyv_refresh"),
    };
  }

  private saveTokens(access: string, refresh: string) {
    localStorage.setItem("heyv_access", access);
    localStorage.setItem("heyv_refresh", refresh);
  }
}

export default new AuthService();
