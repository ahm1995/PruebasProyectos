// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asegúrate de importar tu modelo de usuario si es necesario

module.exports = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // Verificación de la presencia del token
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
      // Verificación del token y decodificación
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Opcional: verifica que el usuario aún existe y tiene permisos
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado o no autorizado' });
      }

      // Revisa si el rol del usuario está incluido en los roles permitidos
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Permiso denegado' });
      }

      // Guarda el usuario completo en la solicitud (opcional, si necesitas sus datos en las siguientes funciones)
      req.user = user;

      // Procede con la solicitud
      next();
    } catch (error) {
      // Manejo de errores específicos de jwt
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
      } else {
        return res.status(500).json({ error: 'Error de autenticación' });
      }
    }
  };
};

