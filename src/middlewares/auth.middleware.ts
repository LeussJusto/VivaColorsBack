import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET no está definido en .env");

// Extender Request para incluir `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      req.user = decoded; // Guardamos info del token en req.user
      next();
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
