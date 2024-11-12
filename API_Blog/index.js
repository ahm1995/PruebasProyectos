// index.js

// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");

require("dotenv").config();

// Crear la aplicación Express
const app = express();

// Configuración de la base de datos
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Middlewares de seguridad
app.use(helmet()); // Agrega cabeceras de seguridad HTTP para proteger contra vulnerabilidades comunes
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Permitir solo el frontend específico
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json()); // Permite procesar JSON en las solicitudes

// Limitar el número de solicitudes por IP (protección contra ataques de fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por IP
});
app.use(limiter);
app.use(morgan("dev"));

// Rutas de la API
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Configuración de Swagger para la documentación de la API
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API para el blog con Node, Express y MongoDB",
    },
    servers: [{ url: "http://localhost:3000/api" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sanitización de entradas
app.use(mongoSanitize());

// Validación de entradas para la creación de un post
app.post(
  "/api/posts",
  [
    body("title").not().isEmpty().withMessage("El título es requerido"),
    body("content")
      .isLength({ min: 10 })
      .withMessage("El contenido debe tener al menos 10 caracteres"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continuar con la creación del post
  }
);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
