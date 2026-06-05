import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner full />;
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}
