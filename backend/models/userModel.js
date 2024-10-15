const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: Number,
    required: true,
    min: 0
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  contraseña: {
    type: String,
    required: true
  },
  permisos: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
