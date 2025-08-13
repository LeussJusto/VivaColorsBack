import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: "user" | "admin";
}

// Middleware básico: verificar token
export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token requerido" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no definido");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    (req as any).user = decoded; // Guardar datos en la request
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

// Middleware extra: verificar rol
export function verificarRol(rolesPermitidos: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).user;
    if (!usuario) {
      return res.status(401).json({ error: "No se encontró usuario en la solicitud" });
    }

    if (!rolesPermitidos.includes(usuario.role)) {
      return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
    }

    next();
  };
}
