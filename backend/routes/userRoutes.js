const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para crear un usuario
router.post('/', userController.createUser);

// Ruta para iniciar sesión (Login)
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/', authMiddleware.verifyToken, userController.getUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);

module.exports = router;
