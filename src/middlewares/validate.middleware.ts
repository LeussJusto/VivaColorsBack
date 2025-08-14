import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";

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

// Validación para crear cotización
export async function validateCreateQuote(req: Request, res: Response, next: NextFunction) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Debe agregar al menos un producto" });
  }

  for (const item of items) {
    if (!item.product || item.quantity === undefined) {
      return res.status(400).json({ error: "Cada item debe tener product y quantity" });
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser un número entero mayor a 0" });
    }

    const productExists = await Product.findById(item.product);
    if (!productExists) {
      return res.status(400).json({ error: `Producto ${item.product} no encontrado` });
    }
  }

  next();
}

export function validateUpdateQuoteStatus(req: Request, res: Response, next: NextFunction) {
  const { status, rejectionReason } = req.body;

  if (!["aprobada", "rechazada"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  if (status === "rechazada" && !rejectionReason) {
    return res.status(400).json({ error: "Debe indicar el motivo del rechazo" });
  }

  next();
}


// Validación de creación de orden
export async function validateCreateOrder(req: Request, res: Response, next: NextFunction) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Debe agregar al menos un producto" });
  }

  for (const item of items) {
    if (!item.product || item.quantity === undefined) {
      return res.status(400).json({ error: "Cada item debe tener product y quantity" });
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser un número entero mayor a 0" });
    }

    const productExists = await Product.findById(item.product);
    if (!productExists) {
      return res.status(400).json({ error: `Producto ${item.product} no encontrado` });
    }
  }

  next();
}

export function validateUpdateOrderStatus(req: Request, res: Response, next: NextFunction) {
  const { status } = req.body;
  const validStatuses = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  next();
}
