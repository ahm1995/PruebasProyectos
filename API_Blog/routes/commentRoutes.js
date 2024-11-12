// routes/commentRoutes.js

const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rutas de comentarios
router.post('/:postId/comments', authMiddleware(['reader', 'writer', 'moderator', 'admin']), commentController.createComment);
router.patch('/comments/:commentId/flag', authMiddleware(['moderator', 'admin']), commentController.flagComment);
router.delete('/comments/:commentId', authMiddleware(['reader', 'writer', 'moderator', 'admin']), commentController.deleteComment);

module.exports = router;
