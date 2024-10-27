import jwt from "jsonwebtoken"

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Agregar la información del token decodificado al request
    req.user = decoded;
    next();
  });
};

// Middleware para verificar si el usuario es admin
export const verifyAdmin = (req, res, next) => {
  if (req.user.userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requieren userRole de administrador' });
  }
  next();
};