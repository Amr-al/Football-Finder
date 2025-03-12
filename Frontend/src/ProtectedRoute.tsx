import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGlobalState } from "./context/GlobalStateContext";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Roles allowed to access the route
  redirectTo?: string; // Route to redirect unauthorized users
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  redirectTo = "/",
}) => {
  const { user, loading } = useGlobalState(); // Get the user and loading state

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching user data
  }

  // Check if the user is authenticated and has the required role
  if (!user) {
    return <Navigate to={redirectTo} replace />; // Redirect to login if not authenticated
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />; // Redirect if the user doesn't have the required role
  }

  return <Outlet />; // Render the child routes if authorized
};

export default ProtectedRoute;
