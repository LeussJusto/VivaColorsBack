import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { MongoUserRepository } from "../../../infrastructure/db/mongo/repositories/MongoUserRepository";

const userRepo: IUserRepository = new MongoUserRepository();

export const userResolvers  = {
  Query: {

    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");

      const user = await userRepo.findById(context.user.id);
      if (!user) throw new Error("Usuario no encontrado");

      return user;
    },

    users: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");

      const allUsers = await userRepo.getAll(); 
      return allUsers;
    },
  },

  Mutation: {
    registerUser: async (_: any, { input }: any) => {
      const { name, email, password, role = "user" } = input;

      const existing = await userRepo.findByEmail(email);
      if (existing) throw new Error("El usuario ya existe");

      const hashed = await bcrypt.hash(password, 10);

      const created = await userRepo.create({
        name,
        email,
        password: hashed,
        role,
      });

      return created;
    },

    loginUser: async (_: any, { input }: any) => {
      const { email, password } = input;

      const user = await userRepo.findByEmail(email);
      if (!user) throw new Error("Credenciales inválidas");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Credenciales inválidas");

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token, user };
    },

    logoutUser: async () => true, 
  },
};
