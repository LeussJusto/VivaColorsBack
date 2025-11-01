import { IQuoteRepository } from "../../../domain/repositories/IQuoteRepository";
import { MongoQuoteRepository } from "../../../infrastructure/db/mongo/repositories/MongoQuoteRepository";
import { QuoteModel } from "../../../infrastructure/db/mongo/models/QuoteModel";
import { validQuoteStatuses } from "../../../domain/entities/Quote";

const quoteRepo: IQuoteRepository = new MongoQuoteRepository();

export const quoteResolvers = {
  Query: {
    quotes: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      return context.user.role === "admin"
        ? quoteRepo.getAll()
        : quoteRepo.getByUser(context.user.id);
    },

    quote: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");
      return quoteRepo.findById(id);
    },
  },

  Mutation: {
    createQuote: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("No autenticado");

      const newQuote = await quoteRepo.create({
        user: context.user.id,
        items: input.items,
        total: input.total,
        status: "pendiente",
      });

      return newQuote;
    },

    updateQuoteStatus: async (_: any, { id, status, rejectionReason }: any, context: any) => {
      if (!context.user || context.user.role !== "admin")
        throw new Error("No autorizado");

      if (!validQuoteStatuses.includes(status))
        throw new Error("Estado no válido");

      const updated = await quoteRepo.updateStatus(id, status, rejectionReason);
      if (!updated) throw new Error("Cotización no encontrada");

      return updated;
    },

    deleteQuote: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== "admin")
        throw new Error("No autorizado");

      const deleted = await QuoteModel.findByIdAndDelete(id);
      if (!deleted) throw new Error("Cotización no encontrada");

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
        rejectionReason: deleted.rejectionReason,
        createdAt: deleted.createdAt,
      };
    },
  },
};
