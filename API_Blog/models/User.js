// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Definir el esquema de usuario
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["reader", "writer", "moderator", "admin"],
      default: "reader",
    },
    postRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    // Otros campos de configuración
    permissions: {
      canPublishDirectly: { type: Boolean, default: false },
      canApprovePosts: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true }, // Para validar cuentas
    isVerified: { type: Boolean, default: false }, // Para validar cuentas
    verificationToken: { type: String }, // Asegúrate de que este campo esté definido
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Exportar el modelo
module.exports = mongoose.model("User", userSchema);
