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
      enum: ["admin", "moderator", "client", "user"],
      default: "user",
    },
    permissions: {
      create: {
        users: { type: Boolean, default: false },
        licences: { type: Boolean, default: false },
        post: { type: Boolean, default: false },
        clients: { type: Boolean, default: false },
        sales: { type: Boolean, default: false },
        notes: { type: Boolean, default: false },
        calendar: { type: Boolean, default: false },
      },
      read: {
        users: { type: Boolean, default: false },
        licences: { type: Boolean, default: false },
        post: { type: Boolean, default: false },
        clients: { type: Boolean, default: false },
        sales: { type: Boolean, default: false },
        notes: { type: Boolean, default: false },
        calendar: { type: Boolean, default: false },
      },
      update: {
        users: { type: Boolean, default: false },
        licences: { type: Boolean, default: false },
        post: { type: Boolean, default: false },
        clients: { type: Boolean, default: false },
        sales: { type: Boolean, default: false },
        notes: { type: Boolean, default: false },
        calendar: { type: Boolean, default: false },
      },
      delete: {
        users: { type: Boolean, default: false },
        licences: { type: Boolean, default: false },
        post: { type: Boolean, default: false },
        clients: { type: Boolean, default: false },
        sales: { type: Boolean, default: false },
        notes: { type: Boolean, default: false },
        calendar: { type: Boolean, default: false },
      },0
    },
    isActive: { type: Boolean, default: true },
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
