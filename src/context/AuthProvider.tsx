import { useEffect, useMemo, useState } from "react";
import {
  getCurrentUserClaims,
  fetchCurrentUser,
  isAuthenticated as hasAccessToken,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
  register as registerRequest,
  type AuthUser,
} from "../lib/auth";
import { AuthContext, type AuthContextValue, type AuthProviderProps } from "./auth-context";

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(hasAccessToken());
  const [checking, setChecking] = useState(!hasAccessToken());
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUserClaims());

  useEffect(() => {
    let ignore = false;

    // Au chargement, on rehydrate la session depuis l'access token ou le refresh cookie.
    async function initializeSession() {
      if (hasAccessToken()) {
        try {
          const currentUser = await fetchCurrentUser();

          if (!ignore) {
            setAuthenticated(true);
            setUser(currentUser);
          }
        } catch {
          if (!ignore) {
            setAuthenticated(true);
            setUser(getCurrentUserClaims());
          }
        } finally {
          if (!ignore) {
            setChecking(false);
          }
        }
        return;
      }

      const token = await refreshAccessToken();

      if (!ignore) {
        setAuthenticated(Boolean(token));
        setUser(token ? await fetchCurrentUser().catch(() => getCurrentUserClaims()) : null);
        setChecking(false);
      }
    }

    initializeSession();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated,
      checking,
      user,
      async login(payload) {
        const session = await loginRequest(payload);
        setAuthenticated(true);
        setUser(session.user);
        return session;
      },
      async register(payload) {
        const session = await registerRequest(payload);
        setAuthenticated(Boolean(session));
        setUser(session?.user || null);
        return session;
      },
      async logout() {
        await logoutRequest();
        setAuthenticated(false);
        setUser(null);
      },
      async refreshSession() {
        const token = await refreshAccessToken();
        const currentUser = token ? await fetchCurrentUser().catch(() => getCurrentUserClaims()) : null;

        setAuthenticated(Boolean(token));
        setUser(currentUser);
        return token;
      },
    }),
    [authenticated, checking, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
