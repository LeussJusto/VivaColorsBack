import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/perfil", verificarToken, (req, res) => {
  res.json({ message: "Perfil del usuario", user: (req as any).user });
});

router.get("/admin-panel", verificarToken, verificarRol(["admin"]), (req, res) => {
  res.json({ message: "Bienvenido al panel de administración" });
});

export default router;
