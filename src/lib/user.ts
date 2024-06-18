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

export function getUserById(id: number) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserType;
}

export function changeImage(image: string, id: number) {
  return db.prepare("UPDATE users SET image = ? WHERE id = ?").run(image, id);
}
export function changeName(name: string, id: number) {
  return db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, id);
}
export function changePassword(password: string, id: number) {
  return db
    .prepare("UPDATE users SET password = ? WHERE id = ?")
    .run(password, id);
}
