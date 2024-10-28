import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  let permisos;
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    permisos = decodedToken.permisos;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/login" />;
  }

  // Verificar si los permisos están definidos y coinciden con el rol requerido
  if (permisos === undefined || (Array.isArray(requiredRole) ? !requiredRole.includes(permisos) : permisos !== requiredRole)) {
    return <Navigate to="/login" />;
  }

  // Si el rol es correcto, renderiza el componente hijo
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default PrivateRoute;
