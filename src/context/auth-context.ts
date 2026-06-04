import { createContext, type ReactNode } from "react";
import { type AuthSession, type AuthUser, type LoginPayload, type RegisterPayload } from "../lib/auth";

export type AuthContextValue = {
  authenticated: boolean;
  checking: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
