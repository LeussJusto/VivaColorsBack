import { IQuoteRepository } from "../../../../domain/repositories/IQuoteRepository";
import { IQuote } from "../../../../domain/entities/Quote";
import { QuoteModel } from "../models/QuoteModel";

export class MongoQuoteRepository implements IQuoteRepository {
  async create(quote: IQuote): Promise<IQuote> {
    const created = await QuoteModel.create(quote);
    return {
      id: created.id,
      user: created.user.toString(),
      items: created.items.map(i => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: created.total,
      status: created.status,
      rejectionReason: created.rejectionReason,
      createdAt: created.createdAt,
    };
  }

  async findById(id: string): Promise<IQuote | null> {
    const quote = await QuoteModel.findById(id).populate("user").populate("items.product");
    if (!quote) return null;

    return {
      id: quote.id,
      user: quote.user.toString(),
      items: quote.items.map(i => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: quote.total,
      status: quote.status,
      rejectionReason: quote.rejectionReason,
      createdAt: quote.createdAt,
    };
  }

  async getAll(): Promise<IQuote[]> {
    const quotes = await QuoteModel.find().populate("user");
    return quotes.map(q => ({
      id: q.id,
      user: q.user.toString(),
      items: q.items.map(i => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: q.total,
      status: q.status,
      rejectionReason: q.rejectionReason,
      createdAt: q.createdAt,
    }));
  }

  async getByUser(userId: string): Promise<IQuote[]> {
    const quotes = await QuoteModel.find({ user: userId }).populate("items.product");
    return quotes.map(q => ({
      id: q.id,
      user: q.user.toString(),
      items: q.items.map(i => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: q.total,
      status: q.status,
      rejectionReason: q.rejectionReason,
      createdAt: q.createdAt,
    }));
  }

  async updateStatus(id: string, status: string, reason?: string): Promise<IQuote | null> {
    const updated = await QuoteModel.findByIdAndUpdate(
      id,
      { status, rejectionReason: reason || "" },
      { new: true }
    );
    if (!updated) return null;

    return {
      id: updated.id,
      user: updated.user.toString(),
      items: updated.items.map(i => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: updated.total,
      status: updated.status,
      rejectionReason: updated.rejectionReason,
      createdAt: updated.createdAt,
    };
  }
}
