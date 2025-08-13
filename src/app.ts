import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
//import productRoutes from "./routes/productRoutes";

const app = express();

// Middlewares
app.use(morgan("dev"));          // Logs de peticiones
app.use(express.json());         // Parsear JSON
app.use(cookieParser());         // Leer cookies

// Rutas
app.use("/api/users", userRoutes);

// Ruta base para pruebas
app.get("/", (req, res) => {
  res.send("✅ Backend Viba Colors corriendo");
});

export default app;
