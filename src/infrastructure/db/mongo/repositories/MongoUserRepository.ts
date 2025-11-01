import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IUser } from "../../../../domain/entities/User";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role, 
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role, 
    };
  }

  async create(user: IUser): Promise<IUser> {
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role, 
    });

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      role: created.role, 
    };
  }
  async getAll(): Promise<IUser[]> {
  const users = await UserModel.find();
  return users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
  }));
  }
}
