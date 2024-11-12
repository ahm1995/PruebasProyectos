const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 }); // TTL de 1 hora (60 minutos)

const cacheMiddleware = (req, res, next) => {
  // Generar la clave de caché basada en la URL original, incluyendo parámetros de consulta
  const key = req.originalUrl;

  // Comprobar si hay datos en caché
  const cachedData = cache.get(key);
  if (cachedData) {
    // Si hay datos en caché, devolverlos directamente
    return res.json(cachedData);
  }

  // Sobrescribir el método res.json para almacenar los datos en caché
  const originalJson = res.json;
  res.json = (body) => {
    // Guardar los datos en caché antes de enviar la respuesta
    cache.set(key, body);
    // Llamar al método original res.json para enviar la respuesta
    originalJson.call(res, body);
  };

  // Pasar al siguiente middleware
  next();
};

module.exports = cacheMiddleware;
