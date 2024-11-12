// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/dashboard', authMiddleware(['admin']), adminDashboardController.getDashboardMetrics);
// Administración de usuarios
router.get('/users', authMiddleware(['admin']), adminController.getAllUsers);
router.delete('/users/:id', authMiddleware(['admin']), adminController.deleteUser);

// Administración de publicaciones
router.get('/posts', authMiddleware(['admin']), adminController.getAllPosts);
router.delete('/posts/:id', authMiddleware(['admin']), adminController.deletePost);

module.exports = router;
