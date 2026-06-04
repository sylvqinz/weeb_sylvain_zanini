import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function getAccessToken() {
  return sessionStorage.getItem("access");
}

export function setAccessToken(token: string) {
  sessionStorage.setItem("access", token);
}

export function clearAccessToken() {
  sessionStorage.removeItem("access");
}

// Le backend peut renvoyer plusieurs formats d'erreurs; on les reduit en message lisible.
export function formatErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Une erreur est survenue pendant la requête.";
  }

  const errors = data as Record<string, unknown>;
  const simpleMessage = errors.detail || errors.details || errors.message || errors.error;

  if (typeof simpleMessage === "string") {
    return simpleMessage;
  }

  if (Array.isArray(simpleMessage)) {
    return simpleMessage.join(" ");
  }

  if (errors.errors && typeof errors.errors === "object") {
    const nestedMessage: string = formatErrorMessage(errors.errors);

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return Object.entries(errors)
    .filter(([field]) => field !== "error_code" && field !== "code")
    .map(([field, value]) => {
      if (Array.isArray(value)) {
        return `${field}: ${value.join(", ")}`;
      }

      if (typeof value === "string") {
        return `${field}: ${value}`;
      }

      return `${field}: ${JSON.stringify(value)}`;
    })
    .join(" ");
}

export async function publicPost<T>(path: string, payload: object) {
  try {
    const response = await axios.post<T>(`${API_URL}${path}`, payload, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error("Impossible de contacter le serveur.");
      }

      throw new Error(formatErrorMessage(error.response.data));
    }

    throw error;
  }
}

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/users/token/refresh/")) {
      clearAccessToken();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      return Promise.reject(error);
    }

    // Sur un 401, on tente une seule fois de recuperer un access token via le cookie refresh.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post<{ access?: unknown; access_token?: unknown }>(
          "/users/token/refresh/",
          {},
          { withCredentials: true },
        );
        const token = response.data.access || response.data.access_token;

        if (typeof token !== "string" || !token.trim()) {
          clearAccessToken();
          window.location.assign("/login");
          return Promise.reject(error);
        }

        setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function request<T>(path: string, config: AxiosRequestConfig = {}) {
  try {
    const response = await api.request<T>({
      url: path,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(formatErrorMessage(error.response?.data));
    }

    throw error;
  }
}

export default api;
