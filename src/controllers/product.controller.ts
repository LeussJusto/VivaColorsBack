import { Request, Response } from "express";
import Product from "../models/product.model";

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock } = req.body;

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ error: "El producto ya existe" });
    }

    const product = new Product({ name, description, price, stock });
    await product.save();

    res.status(201).json({ message: "Producto creado", product });
  } catch (err) {
    res.status(500).json({ error: "Error al crear producto" });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      name: { $regex: search as string, $options: "i" },
    };

    const products = await Product.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Product.countDocuments(query);

    res.json({ total, page: +page, limit: +limit, products });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado", product });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}
