import db from "#db/client";
import bcrypt from "bcrypt";

// CREATE USER (with password hashing)
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10); // hash before insert
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;  -- don't return password
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

// LOGIN: GET USER BY USERNAME + PASSWORD
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1;
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  // remove hashed password from the object before returning
  delete user.password;
  return user;
}

// GET USER BY ID
export async function getUserById(id) {
  const sql = `
    SELECT id, username
    FROM users
    WHERE id = $1;
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
