import { Router } from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";
import { validateCreateOrder, validateUpdateOrderStatus } from "../middlewares/validate.middleware";

const router = Router();

// Crear orden (usuario)
router.post("/", verificarToken, validateCreateOrder, createOrder);

// Listar órdenes
router.get("/", verificarToken, getOrders);

// Actualizar estado (solo admin)
router.put("/:id/status", verificarToken, verificarRol(["admin"]), validateUpdateOrderStatus, updateOrderStatus);

// Eliminar orden
router.delete("/:id", verificarToken, deleteOrder);

export default router;
