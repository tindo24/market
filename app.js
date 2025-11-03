import "dotenv/config";
import express from "express";
import usersRouter from "#api/users";
import ordersRouter from "#api/orders";
import productsRouter from "#api/products";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02": // Invalid input syntax for type
      return res.status(400).send(err.message);
    case "23505": // Unique violation
    case "23503": // Foreign key violation
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
