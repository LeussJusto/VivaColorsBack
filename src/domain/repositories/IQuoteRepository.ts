import { IQuote } from "../entities/Quote";

export interface IQuoteRepository {
  create(quote: IQuote): Promise<IQuote>;
  findById(id: string): Promise<IQuote | null>;
  getAll(): Promise<IQuote[]>;
  getByUser(userId: string): Promise<IQuote[]>;
  updateStatus(id: string, status: string, reason?: string): Promise<IQuote | null>;
}
