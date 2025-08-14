import { Request, Response } from "express";
import Order from "../models/order.model";
import Product from "../models/product.model";

// Crear orden
export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { items } = req.body; // [{ product, quantity }]

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      const price = product!.price; // asumimos que la validación ya verificó existencia
      total += price * item.quantity;

      orderItems.push({ product: product!._id, quantity: item.quantity, price });
    }

    const newOrder = new Order({ user: userId, items: orderItems, total });
    await newOrder.save();

    res.status(201).json({ message: "Orden creada", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Error al crear orden" });
  }
}

// Listar órdenes
export async function getOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    let orders;
    if (role === "admin") {
      orders = await Order.find().populate("user").populate("items.product");
    } else {
      orders = await Order.find({ user: userId }).populate("items.product");
    }

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
}

// Actualizar estado (solo admin)
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Estado actualizado", order });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar orden" });
  }
}

// Eliminar orden
export async function deleteOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    res.json({ message: "Orden eliminada", order });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar orden" });
  }
}
