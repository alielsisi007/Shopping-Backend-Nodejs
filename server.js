import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error.message));

// Use Routes
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
