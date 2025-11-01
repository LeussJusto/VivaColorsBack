import { Types } from "mongoose";

export interface IQuoteItem {
  product: Types.ObjectId | string;
  quantity: number;
  price: number;
}

export type QuoteStatus = "pendiente" | "aprobada" | "rechazada";

export interface IQuote {
  id?: string;
  user: Types.ObjectId | string;
  items: IQuoteItem[];
  total: number;
  status: QuoteStatus;
  rejectionReason?: string;
  createdAt?: Date;
}

export const validQuoteStatuses: QuoteStatus[] = ["pendiente", "aprobada", "rechazada"];
