import { Router } from "express";
import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
  deleteQuote,
} from "../controllers/quote.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";
import { validateCreateQuote, validateUpdateQuoteStatus } from "../middlewares/validate.middleware";

const router = Router();

router.post("/", verificarToken, validateCreateQuote, createQuote);
router.get("/", verificarToken, getQuotes);
router.put("/:id/status", verificarToken, verificarRol(["admin"]), validateUpdateQuoteStatus, updateQuoteStatus);
router.delete("/:id", verificarToken, deleteQuote);

export default router;
