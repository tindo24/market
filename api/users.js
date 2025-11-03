import express from "express";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);

      const token = createToken({ id: user.id });
      res.status(201).send(token); //send the token string directly, Kept failing hee
    } catch (error) {
      console.error("Error in /register:", error);
      res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsernameAndPassword(username, password);

      if (!user) {
        return res.status(401).send("Invalid username or password");
      }

      const token = createToken({ id: user.id });
      res.status(200).send(token); // send token string directly: second error
    } catch (error) {
      console.error("Error in /login:", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default router;
