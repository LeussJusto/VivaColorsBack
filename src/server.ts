import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config(); // Carga variables de entorno

// Conectar a MongoDB
connectDB();

// Puerto del servidor
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Web server running on port: ${PORT}`);
});
