import { Types } from 'mongoose';
import { OrderStatus } from './OrderStatus';

export interface IOrderItem {
  product: Types.ObjectId | string; 
  quantity: number;
  price: number;
}

export interface IOrder {
  id?: string;
  user: Types.ObjectId | string; 
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt?: Date;
}
