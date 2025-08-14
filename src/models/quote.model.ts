import mongoose, { Document, Schema } from "mongoose";

interface IQuoteItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IQuote extends Document {
  user: mongoose.Types.ObjectId;
  items: IQuoteItem[];
  total: number;
  status: "pendiente" | "aprobada" | "rechazada";
  rejectionReason?: string; // motivo de rechazo
  createdAt: Date;
}

const quoteItemSchema = new Schema<IQuoteItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const quoteSchema = new Schema<IQuote>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [quoteItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pendiente", "aprobada", "rechazada"],
    default: "pendiente",
  },
  rejectionReason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuote>("Quote", quoteSchema);
