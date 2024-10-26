const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); // Para el logging de peticiones HTTP
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http"); // Importar serverless-http

// Cargar configuración de variables de entorno
dotenv.config();

// Inicializar la app de Express
const app = express();

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;

// Middleware para logging de peticiones HTTP
app.use(morgan("dev"));

// Middleware para parsear JSON de las solicitudes
app.use(express.json());

app.use(cors());

app.options("*", cors());

// Conectar a MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Rutas de usuarios
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Rutas de productos
const productRoutes = require("./routes/productRoutes");
app.use("/api/product", productRoutes);

const uploadRoutes = require("./routes/uploadRoutes"); // Asegúrate de que la ruta sea correcta
app.use("/api/upload", uploadRoutes); // Asigna un prefijo para la ruta de carga de archivos

// Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en el puerto ${PORT}`);
// });
module.exports.handler = serverless(app);
