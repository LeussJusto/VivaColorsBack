import { IUser } from "../entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  getAll(): Promise<IUser[]>; 
}