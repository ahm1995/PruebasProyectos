import express from 'express';
import { createUser, loginUser, getUsers, getUserById, updateUser } from '../controllers/userController.mjs'; // Asegúrate de que la extensión sea .mjs
import { verifyToken } from '../middleware/authMiddleware.mjs'; // Asegúrate de que la extensión sea .mjs

const userRouter = express.Router();

// Ruta para crear un usuario
userRouter.post('/', createUser);

// Ruta para iniciar sesión (Login)
userRouter.post('/login', loginUser);

// Rutas protegidas
userRouter.get('/', verifyToken, getUsers);
userRouter.get('/:id', verifyToken, getUserById);
userRouter.patch('/:id', verifyToken, updateUser);

// Exportar el router como exportación predeterminada
export default userRouter;
