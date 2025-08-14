import { Request, Response, NextFunction } from "express";

// Middleware para validar registro de usuario
export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  next();
}

// Middleware para validar login de usuario
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  next();
}
