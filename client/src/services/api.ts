import authService from "./auth.ts";
import { API_URL, notifyUnauthorized } from "./config.ts";

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

let refreshPromise: Promise<void> | null = null;

const refreshTokens = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refresh } = authService.getTokensFromStorage();

      if (!refresh) {
        throw new Error("Refresh token is not present.");
      }

      await authService.refresh(refresh);
    })()
      .catch((error) => {
        authService.clearTokens();
        notifyUnauthorized();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

class HTTPService {
  private async request<T>(url: string, method: Method, body?: T): Promise<unknown> {
    const headers = new Headers();

    const { access } = authService.getTokensFromStorage();

    if (access) {
      headers.set("Authorization", `Bearer ${access}`);
    }

    const requestInit: RequestInit = { method, headers };

    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
      requestInit.body = JSON.stringify(body);
    }

    let response = await fetch(`${API_URL}${url}`, requestInit);

    if (response.status === 401 && !url.startsWith("/auth/")) {
      try {
        await refreshTokens();
      } catch {
        throw new ApiError(401, "Session expired.");
      }

      const { access: newAccess } = authService.getTokensFromStorage();

      if (newAccess) {
        headers.set("Authorization", `Bearer ${newAccess}`);
      }

      response = await fetch(`${API_URL}${url}`, requestInit);
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Request to ${url} failed.`,
        await parseErrorDetails(response),
      );
    }

    if (response.status === 204) {
      return undefined;
    }

    return response.json();
  }

  public get<Response>(url: string): Promise<Response> {
    return this.request(url, "GET") as Promise<Response>;
  }

  public post<Body, Response = undefined>(url: string, body?: Body): Promise<Response> {
    return this.request(url, "POST", body) as Promise<Response>;
  }

  public patch<Body, Response = undefined>(url: string, body: Body): Promise<Response> {
    return this.request(url, "PATCH", body) as Promise<Response>;
  }
}

const parseErrorDetails = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

export default new HTTPService();
