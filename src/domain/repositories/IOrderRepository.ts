import { IOrder } from "../entities/Order";

export interface IOrderRepository {
  create(order: IOrder): Promise<IOrder>;
  findById(id: string): Promise<IOrder | null>;
  getAll(): Promise<IOrder[]>;
  getByUser(userId: string): Promise<IOrder[]>;
  updateStatus(id: string, status: string): Promise<IOrder | null>;
}
