import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem('token');

  // Aquí puedes validar el token y obtener el rol desde localStorage o decodificar el token
  const userRole = role; // Aquí asumimos que el rol viene directamente

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
