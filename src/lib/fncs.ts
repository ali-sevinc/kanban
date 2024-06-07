"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabase } from "./supabase";
import { createUser, getUserByEmail } from "./user";
import { hashPassword, verifyPassword } from "./hash";
import { createAuthSession, deleteSession } from "./auth";

import { BoardType, ProgressType, TaskType } from "./types";

export async function getBoards(id: string) {
  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("userId", id);
  // revalidatePath("/");
  console.log("getBoards:", boards);
  return { boards, error } as { boards: BoardType[]; error: {} };
}
export async function getTasks(boardId: number) {
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("boardId", boardId);
  revalidatePath("/");
  return { tasks, error } as { tasks: TaskType[]; error: {} };
}
export async function updateTask(taskId: number, progress: ProgressType) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ progress })
    .eq("id", taskId)
    .select();

  revalidatePath("/");
  return { data, error };
}

type AddBoard = { title: string; slug: string; id: string };
export async function addBoard({ title, slug, id }: AddBoard) {
  const { data, error } = await supabase
    .from("boards")
    .insert([{ title, slug, userId: id }])
    .select();
  revalidatePath("/");
  return { data, error };
}
export async function deleteBoard(boardId: number) {
  const { error } = await supabase.from("boards").delete().eq("id", boardId);
  revalidatePath("/");
  if (!error) redirect("/");
  return error;
}

export async function addTodo(task: TaskType) {
  const { data, error } = await supabase.from("tasks").insert([task]).select();
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
}

export async function loginWithPass({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error("Ops... Something went wrong!");
  return user;
}

export async function logoutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Cannot logout.");
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log(["getUser"], user);
  return user;
}

type AuthCredentialsType = {
  email: string;
  password: string;
};

//better-sqllite3 actions
export async function signup({ email, password }: AuthCredentialsType) {
  const hashedPassword = hashPassword(password);
  try {
    const userId = createUser(email, hashedPassword);
    console.log(userId);
    const id = userId.toString();
    await createAuthSession(id);
    redirect("/");
  } catch (error) {
    const dbError = error as { code: string; message: string };
    if (dbError?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return "Account cannot created. Please choose a diffrent email.";
    }
    throw error;
  }
}

export async function login({ email, password }: AuthCredentialsType) {
  const user = getUserByEmail(email);
  if (!user) {
    return {
      error: "Could not login. Plase check your credentials.",
    };
  }

  const isPasswordValid = verifyPassword(user.password, password);

  if (!isPasswordValid) {
    return {
      error: "Could not login. Plase check your credentials.",
    };
  }

  await createAuthSession(user.id.toString());

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

type AuthType = { mode: "login" | "signup"; email: string; password: string };
export async function auth({ mode, email, password }: AuthType) {
  if (mode === "login") {
    login({ email, password });
  } else {
    signup({ email, password });
  }
}
