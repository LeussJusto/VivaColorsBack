import { Request, Response } from "express";
import Quote from "../models/quote.model";
import Product from "../models/product.model";

// Crear cotización
export async function createQuote(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { items } = req.body;

    let total = 0;
    const quoteItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      const price = product!.price;
      total += price * item.quantity;
      quoteItems.push({ product: product!._id, quantity: item.quantity, price });
    }

    const newQuote = new Quote({ user: userId, items: quoteItems, total });
    await newQuote.save();

    res.status(201).json({ message: "Cotización creada", quote: newQuote });
  } catch (err) {
    res.status(500).json({ error: "Error al crear cotización" });
  }
}

// Listar cotizaciones
export async function getQuotes(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    let quotes;
    if (role === "admin") {
      quotes = await Quote.find().populate("user").populate("items.product");
    } else {
      quotes = await Quote.find({ user: userId }).populate("items.product");
    }

    res.json({ quotes });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener cotizaciones" });
  }
}

// Actualizar estado (aprobada o rechazada)
export async function updateQuoteStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["aprobada", "rechazada"].includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    if (status === "rechazada" && !rejectionReason) {
      return res.status(400).json({ error: "Debe indicar el motivo del rechazo" });
    }

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status, rejectionReason: status === "rechazada" ? rejectionReason : "" },
      { new: true }
    );

    res.json({ message: `Cotización ${status}`, quote });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cotización" });
  }
}
