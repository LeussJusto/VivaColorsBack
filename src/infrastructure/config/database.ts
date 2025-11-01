import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("❌ Falta la variable MONGO_URI en el .env");
    }

    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ Conexión a MongoDB Atlas exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};
