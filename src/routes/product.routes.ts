import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";
import { validateCreateProduct, validateUpdateProduct } from "../middlewares/validate.middleware";

const router = Router();

// Listar productos (público)
router.get("/", getProducts);

// CRUD (solo admin)
router.post("/", verificarToken, verificarRol(["admin"]), validateCreateProduct, createProduct);
router.put("/:id", verificarToken, verificarRol(["admin"]), validateUpdateProduct, updateProduct);
router.delete("/:id", verificarToken, verificarRol(["admin"]), deleteProduct);

export default router;
