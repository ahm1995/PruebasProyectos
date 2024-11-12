// routes/authRoutes.js

const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { check } = require("express-validator");

const router = express.Router();

// Ruta para el registro de usuarios
router.post(
  "/register",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("El nombre de usuario es requerido"),
    check("email").isEmail().withMessage("Debe proporcionar un email válido"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  authController.registerUser
);

// Ruta para el inicio de sesión
router.post("/login", authController.loginUser);

// Ruta para la verificación de email (con token en la URL)
router.get("/verify-email", authController.verifyEmailToken);

// Ruta para enviar un email de restablecimiento de contraseña
router.post("/forgot-password", authController.forgotPassword);

// Ruta para resetear la contraseña (con token en la URL)
router.post("/reset-password/:token", authController.resetPassword);

// Ruta para obtener la información del perfil del usuario autenticado
router.get("/profile", authMiddleware(["admin"]), authController.getProfile);

module.exports = router;
