import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT no está definido en .env");

app.listen(parseInt(PORT), () => {
  console.log(`🚀 Web server running on port: ${PORT}`);
});
