import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isGuestOnlyRoute, isPublicRoute } from "../routes/routeAccess";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { authenticated, checking } = useAuth();
  const routeIsPublic = isPublicRoute(location.pathname);
  const routeIsGuestOnly = isGuestOnlyRoute(location.pathname);

  if ((routeIsGuestOnly || !routeIsPublic) && !authenticated && checking) {
    return <p className="px-8 pb-20 text-purple-300">Vérification de la session...</p>;
  }

  if (routeIsGuestOnly && authenticated) {
    return <Navigate to="/" replace />;
  }

  if (!routeIsPublic && !authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
