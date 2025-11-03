import db from "#db/client";

// ADD PRODUCT TO ORDER
export async function addProductToOrder(order_id, product_id, quantity) {
  const sql = `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const {
    rows: [orderProduct],
  } = await db.query(sql, [order_id, product_id, quantity]);
  return orderProduct;
}

// GET PRODUCTS FOR AN ORDER
export async function getProductsByOrderId(order_id) {
  const sql = `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      op.quantity
    FROM orders_products op
    JOIN products p ON op.product_id = p.id
    WHERE op.order_id = $1;
  `;
  const { rows } = await db.query(sql, [order_id]);
  return rows;
}

// UPDATE PRODUCT QUANTITY IN ORDER
export async function updateOrderProduct(order_id, product_id, quantity) {
  const sql = `
    UPDATE orders_products
    SET quantity = $3
    WHERE order_id = $1 AND product_id = $2
    RETURNING *;
  `;
  const {
    rows: [orderProduct],
  } = await db.query(sql, [order_id, product_id, quantity]);
  return orderProduct;
}

// REMOVE PRODUCT FROM ORDER
export async function removeProductFromOrder(order_id, product_id) {
  const sql = `
    DELETE FROM orders_products
    WHERE order_id = $1 AND product_id = $2;
  `;
  await db.query(sql, [order_id, product_id]);
  return { success: true };
}

export async function getOrdersByUserIdAndProductId(userId, productId) {
  const sql = `
    SELECT o.*
    FROM orders o
    JOIN orders_products op ON o.id = op.order_id
    WHERE o.user_id = $1 AND op.product_id = $2
  `;
  const { rows } = await db.query(sql, [userId, productId]);
  return rows;
}
