import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

// Registrar usuario
export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    // Validar datos
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

// Login usuario
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validar
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Crear token
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Guardar token en cookie
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

// Logout usuario
export function logoutUser(req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada" });
}
