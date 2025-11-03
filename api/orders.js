import express from "express";
const router = express.Router();

import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from "#db/queries/orders";

import {
  addProductToOrder,
  getProductsByOrderId,
} from "#db/queries/ordersProducts";

import { getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";

// POST /orders — create a new order
router.post("/", requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, note } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const order = await createOrder(date, note, userId);
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders — get all orders for logged-in user
router.get("/", requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:id — get order by id with ownership check
router.get("/:id", requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await getOrderById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user_id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders/:id/products — add product to order with validation
router.post("/:id/products", requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ error: "productId and quantity are required" });
    }

    const order = await getOrderById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user_id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const product = await getProductById(productId);
    if (!product)
      return res.status(400).json({ error: "Product does not exist" });

    const orderProduct = await addProductToOrder(orderId, productId, quantity);
    res.status(201).json(orderProduct);
  } catch (err) {
    console.error("Error adding product to order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /orders/:id/products — get products for an order with ownership check
router.get("/:id/products", requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await getOrderById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user_id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const products = await getProductsByOrderId(orderId);
    res.json(products);
  } catch (err) {
    console.error("Error getting products for order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
