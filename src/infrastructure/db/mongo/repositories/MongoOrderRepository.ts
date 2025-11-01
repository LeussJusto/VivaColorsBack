import { IOrderRepository } from "../../../../domain/repositories/IOrderRepository";
import { IOrder } from "../../../../domain/entities/Order";
import { OrderModel } from "../models/OrderModel";

export class MongoOrderRepository implements IOrderRepository {
  async create(order: IOrder): Promise<IOrder> {
    const created = await OrderModel.create(order);
    return {
      id: created.id,
      user: created.user.toString(),
      items: created.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: created.total,
      status: created.status,
      createdAt: created.createdAt,
    };
  }

  async findById(id: string): Promise<IOrder | null> {
    const order = await OrderModel.findById(id).populate("user").populate("items.product");
    if (!order) return null;

    return {
      id: order.id,
      user: order.user.toString(),
      items: order.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    };
  }

  async getAll(): Promise<IOrder[]> {
    const orders = await OrderModel.find().populate("user");
    return orders.map((o) => ({
      id: o.id,
      user: o.user.toString(),
      items: o.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));
  }

  async getByUser(userId: string): Promise<IOrder[]> {
    const orders = await OrderModel.find({ user: userId }).populate("items.product");
    return orders.map((o) => ({
      id: o.id,
      user: o.user.toString(),
      items: o.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));
  }

  async updateStatus(id: string, status: string): Promise<IOrder | null> {
    const updated = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return null;

    return {
      id: updated.id,
      user: updated.user.toString(),
      items: updated.items.map((i) => ({
        product: i.product.toString(),
        quantity: i.quantity,
        price: i.price,
      })),
      total: updated.total,
      status: updated.status,
      createdAt: updated.createdAt,
    };
  }
}
