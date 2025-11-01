import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { MongoProductRepository } from "../../../infrastructure/db/mongo/repositories/MongoProductRepository";

const productRepo: IProductRepository = new MongoProductRepository();


export const productResolvers = {
  Query: {

    products: async (_: any, { search, page, limit }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");
      try {
        const result = await productRepo.getAll(search || "", page || 1, limit || 10);
        return result.products; 
      } catch (err) {
        throw new Error("Error al obtener productos");
      }
    },

    product: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");
      try {
        const prod = await productRepo.findById(id);
        if (!prod) throw new Error("Producto no encontrado");
        return prod;
      } catch (err) {
        throw new Error("Error al obtener producto");
      }
    },
  },
  Mutation: {

    createProduct: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");
      try {
        return await productRepo.create(input);
      } catch (err) {
        throw new Error("Error al crear producto");
      }
    },

    updateProduct: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");
      try {
        const { id, ...rest } = input;
        const updated = await productRepo.update(id, rest);
        if (!updated) throw new Error("Producto no encontrado");
        return updated;
      } catch (err) {
        throw new Error("Error al actualizar producto");
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      if (context.user.role !== "admin") throw new Error("Acceso denegado");
      try {
        const deleted = await productRepo.delete(id);
        if (!deleted) throw new Error("Producto no encontrado");
        return deleted;
      } catch (err) {
        throw new Error("Error al eliminar producto");
      }
    },
  },
};
