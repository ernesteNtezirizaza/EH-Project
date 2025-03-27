import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

// Component for protecting routes based on authentication and roles
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, userData } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Get user role (lowercase for consistent comparison)
  const userRole = userData?.role?.toLowerCase() || '';

  // Check if user has one of the allowed roles
  const hasRequiredRole = allowedRoles.some(role => 
    role.toLowerCase() === userRole
  );

  // If user doesn't have the required role, redirect to their appropriate dashboard
  if (!hasRequiredRole) {
    if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/dashboard/student" replace />;
    } else if (userRole === 'mentor') {
      return <Navigate to="/dashboard/mentor" replace />;
    } else {
      // If role is unknown or not specified, redirect to login
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If user is authenticated and has the required role, render the child routes
  return <Outlet />;
};

// Component for redirecting authenticated users from public pages (login/register)
export const RedirectIfAuthenticated: React.FC = () => {
  const { isAuthenticated, userData } = useAuth();
  
  if (isAuthenticated && userData) {
    const role = userData.role.toLowerCase();
    
    if (role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (role === 'student') {
      return <Navigate to="/dashboard/student" replace />;
    } else if (role === 'mentor') {
      return <Navigate to="/dashboard/mentor" replace />;
    }
  }
  
  return <Outlet />;
};