import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error("El usuario ya existe");

    const hashed = await bcrypt.hash(password, 10);
    const user: IUser = {
    id: "",
    name,
    email,
    password: hashed,
    role: "user", 
    };

    const createdUser = await this.userRepository.create(user);

    return this.generateToken(createdUser);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    return this.generateToken(user);
  }

  private generateToken(user: IUser) {
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1d",
    });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
