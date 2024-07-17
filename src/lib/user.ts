import db from "./db";
import { UserType } from "./types";
import supabase from "./supabase";

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

export async function createUserSupabse(userData: {
  email: string;
  password: string;
  name?: string;
  image?: string;
}) {
  const { data, error: createError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (createError) throw new Error(createError.message);

  const { data: userInfo, error } = await supabase
    .from("users")
    .insert([
      {
        user_id: data.user?.id,
        name: userData.name,
        image: userData.image,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function loginSupabse(email: string, password: string) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function logoutSupabse() {
  let { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUserSupabase(id: string) {
  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", id);
    if (error) throw new Error(error.message);
    return user as {
      name: string;
      user_id: string;
      image: string;
      id: number;
    } | null;
  } catch (error) {
    throw new Error("Could not get user.");
  }
}
