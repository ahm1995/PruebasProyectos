const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para agregar un nuevo usuario
router.post('/', userController.createUser);

// Ruta para iniciar sesion
router.post('/login', userController.loginUser)

// Ruta para ver todos los usuarios (solo admins)
router.get('/', authMiddleware.verifyToken, userController.getUsers);

// Ruta para ver un usuario por ID (solo admins)
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);

// Ruta para modificar un usuario por ID (solo admins)
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);

module.exports = router;
