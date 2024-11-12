// routes/postRoutes.js

const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cache');
const router = express.Router();

// Rutas de publicaciones
router.post('/', authMiddleware(['writer', "reader"]), postController.createPost);
router.get('/', cacheMiddleware, postController.getPublishedPosts);
router.get('/all', cacheMiddleware, postController.getAllPosts);
router.get('/story/:slug', postController.getPostBySlug);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', authMiddleware(['writer', 'admin']), postController.deletePost);
router.patch('/:postId/approve', authMiddleware(['moderator', 'admin']), postController.approvePost);

module.exports = router;
