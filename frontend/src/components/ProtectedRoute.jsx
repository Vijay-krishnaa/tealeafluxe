import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }

    if (requiredRole === "admin" && user?.role !== "admin") {
      navigate({ to: "/" });
      return;
    }
  }, [isAuthenticated, user, requiredRole, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    return null;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

export const AuthenticatedRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>;
};
