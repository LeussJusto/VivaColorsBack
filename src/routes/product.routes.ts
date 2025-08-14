import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";

const router = Router();

// Listar productos (público)
router.get("/", getProducts);

// CRUD (solo admin)
router.post("/", verificarToken, verificarRol(["admin"]), createProduct);
router.put("/:id", verificarToken, verificarRol(["admin"]), updateProduct);
router.delete("/:id", verificarToken, verificarRol(["admin"]), deleteProduct);

export default router;
