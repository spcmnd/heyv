import authService from "./auth.ts";

class HTTPService {
  private baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      throw new Error("API URL not provided.");
    }

    this.baseUrl = apiUrl;
  }

  public async request<T>(config: { url: string; method: string; body?: T }) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const { access } = authService.getTokensFromStorage();

    if (access) {
      headers.set("Authorization", `Bearer ${access}`);
    }

    const requestInit: RequestInit = {
      method: config.method || "GET",
      headers,
    };

    if (config.body) {
      requestInit.body = JSON.stringify(config.body);
    }

    let response = await fetch(`${this.baseUrl}${config.url}`, requestInit);

    if (response.status === 401) {
      const { refresh } = authService.getTokensFromStorage();

      if (!refresh) {
        throw new Error("Refresh token is not present.");
      }

      await authService.refresh(refresh);
      const { access } = authService.getTokensFromStorage();
      headers.set("Authorization", `Bearer ${access}`);
      response = await fetch(`${this.baseUrl}${config.url}`, requestInit);
    }

    return response;
  }
}

export default new HTTPService();
