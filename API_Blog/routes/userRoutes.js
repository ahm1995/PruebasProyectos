// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta para obtener todos los usuarios (solo accesible para administradores)
router.get("/", authMiddleware(["admin"]), userController.getAllUsers);

// Ruta para obtener un usuario específico por ID
router.get("/:id", userController.getUserById);

// Ruta para actualizar un usuario
router.put("/:id", userController.updateUser);

// Ruta para eliminar un usuario
router.delete("/:id", userController.deleteUser);

module.exports = router;
