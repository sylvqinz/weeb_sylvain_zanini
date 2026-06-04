import axios from "axios";
import { API_URL, clearAccessToken, getAccessToken, publicPost, setAccessToken, api } from "./api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
};

export type PasswordResetRequestPayload = {
  email: string;
};

export type PasswordResetConfirmPayload = {
  uidb64: string;
  token: string;
  password: string;
};

type AuthResponse = {
  access_token?: unknown;
  access?: unknown;
  user?: unknown;
};

export type AuthUser = {
  id?: string | number;
  user_id?: string | number;
  sub?: string | number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_admin?: boolean;
  is_active?: boolean;
  role?: string;
  [key: string]: unknown;
};

export type AuthSession = {
  token: string;
  user: AuthUser | null;
};

export function extractAccessToken(data: AuthResponse) {
  const token = data.access || data.access_token;
  return typeof token === "string" && token.trim() ? token : null;
}

export function extractAuthUser(data: AuthResponse) {
  return data.user && typeof data.user === "object" ? (data.user as AuthUser) : null;
}

export function getCurrentUserClaims() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload = JSON.parse(atob(paddedPayload));

    return decodedPayload && typeof decodedPayload === "object" ? (decodedPayload as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function isAdminUser(user: AuthUser | null) {
  return user?.is_staff === true;
}

export async function fetchCurrentUser() {
  const response = await api.get<AuthUser>("/users/");
  return response.data;
}

async function resolveCurrentUser(fallback: AuthUser | null) {
  try {
    return await fetchCurrentUser();
  } catch {
    return fallback;
  }
}

export async function refreshAccessToken() {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/users/token/refresh/`,
      {},
      { withCredentials: true },
    );
    const token = extractAccessToken(response.data);

    if (!token) {
      clearAccessToken();
      return null;
    }

    setAccessToken(token);
    return token;
  } catch {
    clearAccessToken();
    return null;
  }
}

export async function login(payload: LoginPayload) {
  const data = await publicPost<AuthResponse>("/users/login/", payload);
  const token = extractAccessToken(data);

  if (!token) {
    throw new Error("Connexion réussie, mais aucun token JWT n'a été renvoyé.");
  }

  setAccessToken(token);
  const user = await resolveCurrentUser(extractAuthUser(data) || getCurrentUserClaims());

  return {
    token,
    user,
  };
}

export async function register(payload: RegisterPayload) {
  const data = await publicPost<AuthResponse>("/users/register/", payload);
  const token = extractAccessToken(data);

  if (token) {
    setAccessToken(token);
  }

  const user = token ? await resolveCurrentUser(extractAuthUser(data) || getCurrentUserClaims()) : null;

  return token
    ? {
        token,
        user,
      }
    : null;
}

export function requestPasswordReset(payload: PasswordResetRequestPayload) {
  return publicPost<unknown>("/users/password-reset/request/", payload);
}

export function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  return publicPost<unknown>("/users/password-reset/confirm/", payload);
}

export async function logout() {
  try {
    await api.post("/users/logout/");
  } catch {
    // The local session must be cleared even if the server-side logout endpoint is unavailable.
  } finally {
    clearAccessToken();
  }
}
