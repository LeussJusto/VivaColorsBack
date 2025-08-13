import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

// Conectar a MongoDB
connectDB();

// Obtener puerto desde .env
const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT no está definido en .env");

// Arrancar servidor
app.listen(parseInt(PORT), () => {
  console.log(`🚀 Web server running on port: ${PORT}`);
});
