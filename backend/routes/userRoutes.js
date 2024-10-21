const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para crear un usuario
userRouter.post('/', userController.createUser);

// Ruta para iniciar sesión (Login)
userRouter.post('/login', userController.loginUser);

// Rutas protegidas
userRouter.get('/', authMiddleware.verifyToken, userController.getUsers);
userRouter.get('/:id', authMiddleware.verifyToken, userController.getUserById);
userRouter.patch('/:id', authMiddleware.verifyToken, userController.updateUser);

module.exports = userRouter;
