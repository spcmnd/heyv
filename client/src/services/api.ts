import { AuthService, type TokenCredentials } from "./auth";


class HTTPService {
    private baseUrl: string;
    private credentials: TokenCredentials = {};

    constructor() {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
            throw new Error('API URL not provided.');
        }

        this.baseUrl = apiUrl;
    }

    public setTokenCredentials(credentials: TokenCredentials) {
        this.credentials = credentials;
    }

    public async request<T>(config: { url: string, method: string, body?: T }) {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        if (this.credentials.access) {
            headers.set('Authorization', `Bearer ${this.credentials.access}`);
        }

        const requestInit: RequestInit = {
            method: config.method || 'GET',
            headers,
        };

        if (config.body) {
            requestInit.body = JSON.stringify(config.body);
        }

        let response = await fetch(`${this.baseUrl}${config.url}`, requestInit);

        if (response.status === 401 && this.credentials.refresh) {
            const authService = new AuthService();
            const credentials = await authService.refresh(this.credentials.refresh);

            this.setTokenCredentials(credentials);
            headers.set('Authorization', `Bearer ${this.credentials.access}`);

            response = await fetch(`${this.baseUrl}${config.url}`, requestInit);
        }

        return response;
    }
}

export default new HTTPService();
