import express from "express"; 
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";

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

// Importar rutas usando la sintaxis de importación
import userRouter from "./routes/userRoutes.mjs"; // Asegúrate de que la extensión sea .mjs
app.use("/api/users", userRouter);

import employeeRouter from "./routes/employeeRoutes.mjs";
app.use("/api/employee", employeeRouter)

import productRoutes from "./routes/productRoutes.mjs"; // Asegúrate de que la extensión sea .mjs
app.use("/api/product", productRoutes);

import uploadRoutes from "./routes/uploadRoutes.mjs"; // Asegúrate de que la extensión sea .mjs
app.use("/api/upload", uploadRoutes); // Asigna un prefijo para la ruta de carga de archivos

// Condicional para entorno local
if (process.env.IS_LOCAL) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

// Exportar el handler fuera de la condición
const handler = serverless(app);
export default handler; // Exportar el handler aquí
