import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js'
import orderRoutes from './routes/orderRoutes.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart",cartRoutes);
app.use('/api/address',addressRoutes);
app.use('/api/order',orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Database
connectDB();

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});