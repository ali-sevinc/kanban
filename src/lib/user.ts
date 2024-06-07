import db from "./db";

export function createUser(email: string, password: string) {
  const res = db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .run(email, password);
  return res.lastInsertRowid;
}

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as {
    email: string;
    password: string;
    id: number;
  };
}
