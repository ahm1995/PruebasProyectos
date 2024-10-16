import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decodificar el token para obtener el rol
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const { permisos } = decodedToken;

  // Verificar si el rol coincide con el requerido
  if (permisos !== requiredRole) {
    return <Navigate to="/login" />;
  }

  // Si el rol es correcto, renderiza el componente hijo
  return children;
};

export default PrivateRoute;
