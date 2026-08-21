const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("API URL not provided.");
  }

  return apiUrl;
};

export const API_URL = getApiUrl();

export const UNAUTHORIZED_EVENT = "heyv:unauthorized";

export const notifyUnauthorized = () => {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
};
