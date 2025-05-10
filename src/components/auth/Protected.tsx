
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedProps {
  children: React.ReactNode;
}

// This is a temporary mock implementation
// In a real app, you would use your auth context to check if the user is authenticated
const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const location = useLocation();
  
  // For now, we're assuming the user is always authenticated
  // In a real application, you would check if the user is authenticated
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default Protected;
