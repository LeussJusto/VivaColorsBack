import { Request, Response, NextFunction } from "express";

// validicación registrar usuario
export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  next();
}

// Validación para crear producto
export function validateCreateProduct(req: Request, res: Response, next: NextFunction) {
  const { name, description, price, stock } = req.body;

  if (!name || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "El precio debe ser un número mayor a 0" });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "El stock debe ser un número entero >= 0" });
  }

  next();
}

export function validateUpdateProduct(req: Request, res: Response, next: NextFunction) {
  const { name, description, price, stock } = req.body;

  if (name !== undefined && name.trim() === "") {
    return res.status(400).json({ error: "El nombre no puede estar vacío" });
  }

  if (description !== undefined && description.trim() === "") {
    return res.status(400).json({ error: "La descripción no puede estar vacía" });
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return res.status(400).json({ error: "El precio debe ser un número mayor a 0" });
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    return res.status(400).json({ error: "El stock debe ser un número entero >= 0" });
  }

  next();
}
