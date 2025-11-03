import db from "#db/client";

// CREATE PRODUCT
export async function createProduct(title, description, price) {
  const sql = `
    INSERT INTO products (title, description, price)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const {
    rows: [product],
  } = await db.query(sql, [title, description, price]);
  return product;
}

// GET ALL PRODUCTS
export async function getAllProducts() {
  const sql = `
    SELECT * FROM products ORDER BY id;
  `;
  const { rows } = await db.query(sql);
  return rows;
}

// GET PRODUCT BY ID
export async function getProductById(id) {
  const sql = `
    SELECT * FROM products WHERE id = $1;
  `;
  const {
    rows: [product],
  } = await db.query(sql, [id]);
  return product;
}
