import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth(); // user = { id, name, role, token }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified but user's role is not in that list
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children; // return the child page
}
