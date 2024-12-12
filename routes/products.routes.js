import express from "express";
import Product from "../models/product.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const productsRoutes = express.Router();

// Create Product (only for sellers or admins)
productsRoutes.post(
  "/",
  authMiddleware, // Check user authentication
  roleMiddleware(["admin", "seller"]), // Check if user has 'admin' or 'seller' role
  async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      if (!name || !price || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const product = new Product({
        name,
        price,
        description,
        category,
        createdBy: req.user.id, // Store the user ID who created the product
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Get Products by price or category
productsRoutes.get("/", async (req, res) => {
  const { priceRange, category } = req.query;

  try {
    const filter = {};

    if (priceRange) {
      const [min, max] = priceRange.split("-");
      filter.price = { $gte: min, $lte: max };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create Product (only for sellers or admins)
productsRoutes.post(
  "/",
  authMiddleware, // تحقق من صلاحية المستخدم
  roleMiddleware(["admin", "seller"]), // تحقق من دور المستخدم (admin أو seller)
  async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      if (!name || !price || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      // منطق إنشاء المنتج
      const product = new Product({
        name,
        price,
        description,
        category,
        createdBy: req.user.id, // تخزين معرف المستخدم الذي أنشأ المنتج
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Get All Products
productsRoutes.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // استرجاع جميع المنتجات
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
});

// Delete Product (only for admins or sellers)
productsRoutes.delete(
  "/:id",
  authMiddleware, // تحقق من صلاحية المستخدم
  roleMiddleware(["admin", "seller"]), // تحقق من دور المستخدم (admin أو seller)
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid ID format", success: false });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }

      res.status(200).json({
        message: "Product deleted successfully",
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", success: false });
    }
  }
);

export default productsRoutes;
