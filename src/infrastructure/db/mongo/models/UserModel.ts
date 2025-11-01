import { Schema, model, Document } from "mongoose";
import { IUser } from "../../../../domain/entities/User";

export interface IUserDocument extends Omit<IUser, "id">, Document {}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, 
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = model<IUserDocument>("User", UserSchema);
