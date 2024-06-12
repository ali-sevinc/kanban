import db from "./db";
import { UserType } from "./types";

export function createUser(
  email: string,
  password: string,
  name: string,
  image: string
) {
  const res = db
    .prepare(
      "INSERT INTO users (email, password, name, image) VALUES (?, ?, ?, ?)"
    )
    .run(email, password, name, image);
  return res.lastInsertRowid;
}

export function getUserByEmail(email: string) {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as UserType;
}

export function getUserById(id: string) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserType;
}
