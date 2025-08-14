import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import quoteRoutes from "./routes/quote.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(morgan("dev"));          
app.use(express.json());         
app.use(cookieParser());         

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend Viba Colors corriendo");
});

export default app;
