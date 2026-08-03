import { createContext, type ReactNode } from "react";
import {
  type AuthSession,
  type ConfirmEmailChangePayload,
  type AuthUser,
  type LoginPayload,
  type LoginResult,
  type RegisterPayload,
  type UpdateProfilePayload,
  type UpdateProfileResponse,
  type TwoFactorSetup,
  type VerifyTwoFactorLoginPayload,
} from "../lib/auth";

export type AuthContextValue = {
  authenticated: boolean;
  checking: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<LoginResult>;
  verifyTwoFactorLogin: (payload: VerifyTwoFactorLoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession | null>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UpdateProfileResponse>;
  confirmEmailChange: (payload: ConfirmEmailChangePayload) => Promise<UpdateProfileResponse>;
  setupTwoFactor: () => Promise<TwoFactorSetup>;
  confirmTwoFactor: (code: string) => Promise<void>;
  disableTwoFactor: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
