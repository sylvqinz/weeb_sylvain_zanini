import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshTokenRequest: Promise<string | null> | null = null;

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

function extractRefreshToken(data: { access?: unknown; access_token?: unknown }) {
  const token = data.access || data.access_token;
  return typeof token === "string" && token.trim() ? token : null;
}

export function refreshStoredAccessToken() {
  if (!refreshTokenRequest) {
    refreshTokenRequest = axios
      .post<{ access?: unknown; access_token?: unknown }>(`${API_URL}/users/token/refresh/`, {}, { withCredentials: true })
      .then((response) => {
        const token = extractRefreshToken(response.data);

        if (!token) {
          clearAccessToken();
          return null;
        }

        setAccessToken(token);
        return token;
      })
      .catch(() => {
        clearAccessToken();
        return null;
      })
      .finally(() => {
        refreshTokenRequest = null;
      });
  }

  return refreshTokenRequest;
}

export class ApiError extends Error {
  code?: string;
  details?: string[];

  constructor(message: string, code?: string, details?: string[]) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

function getErrorCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const errors = data as Record<string, unknown>;
  const possibleErrorCode = [errors.error, errors.detail, errors.message].find(
    (value): value is string => typeof value === "string" && /^[A-Z][A-Z0-9_]+$/.test(value),
  );
  const code = errors.error_code || errors.code || possibleErrorCode;

  if (typeof code === "string" && code.trim()) {
    return code;
  }

  return getErrorCode(errors.errors) || getErrorCode(errors.error);
}

function getErrorDetails(data: unknown): string[] | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const errors = data as Record<string, unknown>;

  if (Array.isArray(errors.details)) {
    const details = errors.details.filter(
      (detail): detail is string => typeof detail === "string" && detail.trim().length > 0,
    );

    if (details.length > 0) {
      return details;
    }
  }

  return getErrorDetails(errors.errors) || getErrorDetails(errors.error);
}

export function isApiErrorCode(error: unknown, code: string) {
  return error instanceof ApiError && error.code === code;
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

      throw new ApiError(
        formatErrorMessage(error.response.data),
        getErrorCode(error.response.data),
        getErrorDetails(error.response.data),
      );
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
        const token = await refreshStoredAccessToken();

        if (!token) {
          window.location.assign("/login");
          return Promise.reject(error);
        }

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
      throw new ApiError(
        formatErrorMessage(error.response?.data),
        getErrorCode(error.response?.data),
        getErrorDetails(error.response?.data),
      );
    }

    throw error;
  }
}

export default api;
