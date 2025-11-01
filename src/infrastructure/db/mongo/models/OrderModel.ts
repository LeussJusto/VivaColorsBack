import { Schema, model, Document } from "mongoose";
import { IOrder } from "../../../../domain/entities/Order";
import { OrderStatus, validOrderStatuses } from "../../../../domain/entities/OrderStatus";

export interface IOrderDocument extends Omit<IOrder, "id">, Document {}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrderDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: validOrderStatuses,
    default: "PENDIENTE",
  },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = model<IOrderDocument>("Order", OrderSchema);