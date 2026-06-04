import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdminUser } from "../lib/auth";

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const { authenticated, checking, user } = useAuth();

  if (checking) {
    return <p className="px-8 pb-20 text-purple-300">Vérification de la session...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdminUser(user)) {
    return (
      <section className="px-8 pb-20 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Accès réservé</h1>
        <p className="text-gray-300">Cette interface est disponible uniquement pour les administrateurs.</p>
      </section>
    );
  }

  return children;
}
