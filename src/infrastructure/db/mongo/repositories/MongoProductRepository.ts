import { IProductRepository } from "../../../../domain/repositories/IProductRepository";
import { IProduct } from "../../../../domain/entities/Product";
import { ProductModel } from "../models/ProductModel";

export class MongoProductRepository implements IProductRepository {
  async create(product: IProduct): Promise<IProduct> {
    const created = await ProductModel.create({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt || new Date(),
    });

    return {
      id: created.id,
      name: created.name,
      description: created.description,
      price: created.price,
      stock: created.stock,
      createdAt: created.createdAt,
    };
  }

  async getAll(search = "", page = 1, limit = 10) {
    const query = { name: { $regex: search, $options: "i" } };
    const products = await ProductModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ProductModel.countDocuments(query);
    return {
      total,
      page,
      limit,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        createdAt: p.createdAt,
      })),
    };
  }

  async update(id: string, data: Partial<IProduct>) {
    const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: updated.price,
      stock: updated.stock,
      createdAt: updated.createdAt,
    };
  }

  async delete(id: string) {
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) return null;

    return {
      id: deleted.id,
      name: deleted.name,
      description: deleted.description,
      price: deleted.price,
      stock: deleted.stock,
      createdAt: deleted.createdAt,
    };
  }

  async findById(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt,
  };
}

}
