import { Schema, model, Document } from "mongoose";
import { IQuote } from "../../../../domain/entities/Quote";
import { validQuoteStatuses } from "../../../../domain/entities/Quote";

export interface IQuoteDocument extends Omit<IQuote, "id">, Document {}

const QuoteItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const QuoteSchema = new Schema<IQuoteDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [QuoteItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: validQuoteStatuses,
    default: "pendiente",
  },
  rejectionReason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const QuoteModel = model<IQuoteDocument>("Quote", QuoteSchema);
