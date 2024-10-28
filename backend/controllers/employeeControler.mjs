import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/employeeModel.mjs";
import { addLoginRecord } from "../services/loggingRecords.mjs";

export const hrCreateEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthday,
      phoneNumber,
      email,
      password,
      employeeNumber,
      jobId,
      jobPosition,
      department,
    } = req.body;

    if (
      (!firstName,
      !lastName,
      !birthday,
      !phoneNumber,
      !email,
      !password,
      !employeeNumber,
      !jobId,
      !jobPosition,
      !department)
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const employeeExist = await Employee.findOne({ email });
    if (employeeExist) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new Employee({
      firstName,
      lastName,
      birthday,
      phoneNumber,
      email,
      password: hashedPassword,
      employeeNumber,
      jobRecord: [
        {
            jobId,
            jobPosition,
            department
        }
      ]
    });

    await newEmployee.save();

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        birthday: employee.birthday,
        phoneNumber: employee.phoneNumber,
        email: employee.email,
        active: employee.active,
        employeeNumber: employee.employeeNumber,
        jobId: employee.jobRecord[0].jobId,
        jobPosition: employee.jobRecord[0].jobPosition,
        department: employee.jobRecord[0].department
      },
    });
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;

    addLoginRecord(employee._id, ipAddress, Employee)
  } catch (error) {
    res.status(500).json({ message: "Error al ingresar", error });
  }
};
