const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, edad, correo, contraseña, permisos } = req.body;

    // Validaciones básicas
    if (!nombre || !edad || !correo || !contraseña || !permisos) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya está registrado
    const userExists = await User.findOne({ correo });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      nombre,
      edad,
      correo,
      contraseña: hashedPassword,
      permisos,
      fechaCreacion: new Date(),
      activo: true,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    // Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, permisos: user.permisos },
      process.env.JWT_SECRET
    );

    console.log("Usuario logueado:", user);
    console.log("Rol del usuario:", user.permisos);

    // Responder con el token y los datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        permisos: user.permisos,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Obtener todos los usuarios (solo admins)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID (solo admins)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Modificar un usuario por ID (solo admins)
exports.updateUser = async (req, res) => {
  try {
    const { nombre, edad, correo, permisos, activo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario, excepto la fecha de creación
    user.nombre = nombre || user.nombre;
    user.edad = edad || user.edad;
    user.correo = correo || user.correo;
    user.permisos = permisos || user.permisos;
    user.activo = activo !== undefined ? activo : user.activo;

    await user.save();

    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};
