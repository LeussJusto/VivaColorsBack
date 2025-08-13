import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Falta la variable MONGO_URI en el .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1); 
  }
};
