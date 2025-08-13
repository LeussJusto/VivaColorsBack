import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Ruta protegida de ejemplo
router.get("/perfil", verificarToken, (req, res) => {
  res.json({ message: "Perfil del usuario", user: (req as any).user });
});

export default router;
