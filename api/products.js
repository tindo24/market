import express from "express";
import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByUserIdAndProductId } from "#db/queries/ordersProducts";
import requireUser from "#middleware/requireUser";

const router = express.Router();

// Middleware to check if product exists
async function checkProductExists(req, res, next) {
  const productId = req.params.id;
  try {
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    req.product = product; // store product for later if needed
    next();
  } catch (err) {
    console.error("Error checking product existence:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /products - get all products
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /products/:id - get a specific product by ID
router.get("/:id", checkProductExists, (req, res) => {
  // Since product existence is checked, just send it
  res.json(req.product);
});

// 🔒 GET /products/:id/orders - get all orders by logged-in user that include this product
router.get("/:id/orders", checkProductExists, requireUser, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const orders = await getOrdersByUserIdAndProductId(userId, productId);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders for product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
