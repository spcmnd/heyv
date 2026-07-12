export interface TokenCredentials {
    access?: string;
    refresh?: string;
}

export class AuthService {
    private baseUrl: string;

    constructor() {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
            throw new Error('API URL not provided.');
        }

        this.baseUrl = apiUrl;
    }

    public async login(username: string, password: string) {
        const response = await fetch(`${this.baseUrl}/auth/login/`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json() as Promise<TokenCredentials>;
    }

    public async refresh(refreshToken: string) {
        const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
            method: "POST",
            body: JSON.stringify({ refresh: refreshToken }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // TODO: Redirect to login.
            throw new Error('Session expired.');
        }

        return response.json() as Promise<TokenCredentials>;
    }
}
