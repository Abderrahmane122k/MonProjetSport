import * as SQLite from "expo-sqlite";

let db = null;

export const openDB = async () => {
  db = await SQLite.openDatabaseAsync("sport_app.db");
};

export const initDB = async () => {
  if (!db) await openDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};

export const addUser = async (name, email, password) => {
  if (!db) await openDB();
  await db.runAsync(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?);",
    [name.trim(), email.trim().toLowerCase(), password]
  );
};

export const getUserByEmailPassword = async (email, password) => {
  if (!db) await openDB();
  const user = await db.getFirstAsync(
    "SELECT * FROM users WHERE email = ? AND password = ?;",
    [email.trim().toLowerCase(), password]
  );
  return user; // null si non trouvé
};