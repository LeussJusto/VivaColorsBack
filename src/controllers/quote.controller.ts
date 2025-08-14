import { Request, Response } from "express";
import Quote from "../models/quote.model";
import Product from "../models/product.model";

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

export async function updateQuoteStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const quote = await Quote.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Estado actualizado", quote });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cotización" });
  }
}

export async function deleteQuote(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const quote = await Quote.findByIdAndDelete(id);
    res.json({ message: "Cotización eliminada", quote });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cotización" });
  }
}
