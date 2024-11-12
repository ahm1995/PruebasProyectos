const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Función para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new User({ username, email, password });
    const verificationToken = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = verificationToken;

    await newUser.save();
    await this.sendVerificationEmail(newUser, verificationToken); // Envía el email de verificación

    res
      .status(201)
      .json({ message: "Usuario registrado. Por favor verifica tu email.", verificationToken });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// Función de Verificación de Email
exports.sendVerificationEmail = async (user, token) => {
  user.verificationToken = token;
  await user.save();

  const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Verificación de Email",
    html: `<p>Verifica tu email haciendo clic en el siguiente enlace: <a href="${verificationUrl}">Verificar Email</a></p>`,
  });
};

// Verificación de Token
exports.verifyEmailToken = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });

  if (!user) return res.status(400).json({ message: "Token no válido" });

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.json({ message: "Email verificado con éxito" });
};

// Función para iniciar sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({
          error: "La cuenta está inactiva. Por favor contacta a soporte.",
        });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          error:
            "La cuenta no ha sido verificada. Por favor verifica tu email.",
        });
    }


    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Función para solicitar restablecimiento de contraseña
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No se encontró el usuario" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expira en 1 hora
    await user.save();

    const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Restablecimiento de Contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">Restablecer Contraseña</a></p>`,
    });

    res.json({ message: "Email de restablecimiento enviado", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el email", error });
  }
};

// Función para restablecer contraseña con token
exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, email: email });
    if (!user || user.resetTokenExpires < Date.now()) return res.status(400).json({ message: "Token inválido o expirado" });

    user.password = newPassword; // Asegúrate de que se encripte en el modelo User
    user.resetToken = null; // Limpiar el token
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al restablecer la contraseña", error });
  }
};

// Función para obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
