const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { addLoginRecord } = require("../services/loggingRecords");
// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday,
      phoneNumber,
      email,
      password,
      userRole,
    } = req.body;

    // Validaciones básicas
    if (
      !firstName ||
      !lastName ||
      !birthday ||
      !phoneNumber ||
      !email ||
      !password ||
      !userRole
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el email ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Cifrar la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      birthday,
      phoneNumber,
      email,
      password: hashedPassword,
      userRole,
      registrationDate: new Date(),
      status: true,
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
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    // Verificar si la password es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, userRole: user.userRole },
      process.env.JWT_SECRET
    );

    // Responder con el token y los datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        email: user.email,
        userRole: user.userRole,
        status: user.status,
      },
    });


    addLoginRecord(user._id, User);
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
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Modificar un usuario por ID (solo admins)
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, userRole, status } =
      req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario, excepto la fecha de creación
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (userRole !== undefined) user.userRole = userRole;
    if (status !== undefined) user.status = status;

    await user.save();

    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};
