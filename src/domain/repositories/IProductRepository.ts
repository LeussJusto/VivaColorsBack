import { IProduct } from "../entities/Product";

export interface IProductRepository {
  create(product: IProduct): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  getAll(search?: string, page?: number, limit?: number): Promise<{ total: number; page: number; limit: number; products: IProduct[] }>;
  update(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
}
