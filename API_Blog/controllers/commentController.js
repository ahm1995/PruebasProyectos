// controllers/commentController.js

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const inappropriateWords = ['palabra1', 'palabra2', 'palabra3']; // Agrega palabras inapropiadas aquí
const sanitizeHtml = require('sanitize-html');

// Crear un comentario en un post
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    inappropriateWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        content = content.replace(regex, '***');
      });
  
      // Sanitizar contenido HTML
      content = sanitizeHtml(content);
    
    const comment = new Comment({
      content,
      author: req.user.userId, // ID del usuario autenticado
      post: postId,
    });
    await comment.save();

    // Agregar el comentario al post
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ message: 'Comentario creado', comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Marcar comentario como ofensivo
exports.flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { flagged: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.json({ message: 'Comentario marcado como ofensivo', comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment || (comment.author.toString() !== req.user.userId && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Permiso denegado' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
