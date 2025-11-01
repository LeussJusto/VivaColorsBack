import { Schema, model, Document } from "mongoose";
import { IProduct } from "../../../../domain/entities/Product";

export interface IProductDocument extends Omit<IProduct, "id">, Document {}

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = model<IProductDocument>("Product", productSchema);
