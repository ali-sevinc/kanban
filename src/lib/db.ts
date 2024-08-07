// import sql from "better-sqlite3";

// const db = sql("kanban.db");

// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY,
//     email TEXT UNIQUE,
//     password TEXT,
//     name TEXT,
//     image TEXT
//   );
// `);

// db.exec(`CREATE TABLE IF NOT EXISTS sessions (
//   id TEXT NOT NULL PRIMARY KEY,
//   expires_at INTEGER NOT NULL,
//   user_id TEXT NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// )`);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS boards (
//     id INTEGER PRIMARY KEY,
//     title TEXT,
//     slug TEXT,
//     user_id TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS tasks (
//     id INTEGER PRIMARY KEY,
//     title TEXT,
//     body TEXT,
//     progress TEXT,
//     board_id TEXT NOT NULL,
//     FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS archive (
//     id INTEGER PRIMARY KEY,
//     title TEXT,
//     body TEXT,
//     progress TEXT,
//     board_name TEXT,
//     user_id TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   )
// `);

// export default db;
