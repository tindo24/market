import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { addProductToOrder } from "#db/queries/ordersProducts";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded successfully.");

/**
 * Seed data using query functions
 */
async function seed() {
  try {
    // Clean tables (optional but recommended)
    await db.query(`
      DELETE FROM orders_products;
      DELETE FROM orders;
      DELETE FROM products;
      DELETE FROM users;
    `);

    // Create one user
    const user = await createUser("philip", "secret123");
    console.log("User created:", user);

    // Create 10 products
    const productData = [
      ["Basketball", "Official size basketball", 25.99],
      ["Soccer Ball", "Size 5 training soccer ball", 19.99],
      ["Tennis Racket", "Lightweight graphite frame", 89.99],
      ["Running Shoes", "Men’s running shoes", 59.99],
      ["Water Bottle", "1L BPA-free bottle", 9.99],
      ["Gym Bag", "Medium duffel bag", 39.99],
      ["Yoga Mat", "Non-slip mat for yoga/pilates", 29.99],
      ["Dumbbells", "Set of 10lb dumbbells", 49.99],
      ["Resistance Bands", "Set of 5 color-coded bands", 14.99],
      ["Jump Rope", "Adjustable speed rope", 7.99],
    ];

    const products = [];
    for (const [title, description, price] of productData) {
      const product = await createProduct(title, description, price);
      products.push(product);
    }
    console.log("10 products created");

    //Create an order for that user
    const order = await createOrder(
      new Date(),
      "First order for Philip",
      user.id
    );
    console.log("Order created:", order);

    // Add 5 distinct products to the order
    const selected = products.slice(0, 5);
    for (const product of selected) {
      const quantity = Math.floor(Math.random() * 3) + 1; // random 1–3
      await addProductToOrder(order.id, product.id, quantity);
    }

    console.log("Added 5 products to the order");
    console.log(" Seeding complete!");
  } catch (err) {
    console.error(" Error seeding database:", err);
  }
}
