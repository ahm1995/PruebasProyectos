// models/Comment.js

const mongoose = require('mongoose');

// Definir el esquema de comentario
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo User
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Referencia al modelo Post
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Para comentarios en respuesta
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
}, { timestamps: true }); // Añadir campos de createdAt y updatedAt

// Exportar el modelo
module.exports = mongoose.model('Comment', commentSchema);
