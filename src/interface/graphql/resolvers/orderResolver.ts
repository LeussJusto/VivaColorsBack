import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { MongoOrderRepository } from "../../../infrastructure/db/mongo/repositories/MongoOrderRepository";
import { OrderModel } from "../../../infrastructure/db/mongo/models/OrderModel";
import { OrderStatus, validOrderStatuses } from "../../../domain/entities/OrderStatus";

const orderRepo: IOrderRepository = new MongoOrderRepository();

export const orderResolvers = {
  Query: {
    orders: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      return context.user.role === "admin"
        ? orderRepo.getAll()
        : orderRepo.getByUser(context.user.id);
    },

    order: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      return orderRepo.findById(id);
    },
  },

  Mutation: {
    createOrder: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");

      const newOrder = await orderRepo.create({
        user: context.user.id,
        items: input.items,
        total: input.total,
        status: "PENDIENTE",
      });

      return newOrder;
    },

    updateOrderStatus: async (_: any, { id, status }: any, context: any) => {
      if (!context.user || context.user.role !== "admin")
        throw new Error("No autorizado");

      if (!validOrderStatuses.includes(status as OrderStatus)) {
        throw new Error("Estado de orden no válido");
      }

      const updated = await orderRepo.updateStatus(id, status);
      if (!updated) throw new Error("Orden no encontrada");

      return updated;
    },

    deleteOrder: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== "admin")
        throw new Error("No autorizado");

      const deleted = await OrderModel.findByIdAndDelete(id);
      if (!deleted) throw new Error("Orden no encontrada");

      return {
        id: deleted.id,
        user: deleted.user.toString(),
        items: deleted.items.map((i: any) => ({
          product: i.product.toString(),
          quantity: i.quantity,
          price: i.price,
        })),
        total: deleted.total,
        status: deleted.status,
        createdAt: deleted.createdAt,
      };
    },
  },
};
