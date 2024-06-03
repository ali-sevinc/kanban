"use server";
import { redirect } from "next/navigation";
import { BoardType, ProgressType, TaskType } from "./types";
import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const USER_ID = process.env.USER_ID;

export async function getBoards() {
  let { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("userId", USER_ID);
  revalidatePath("/");
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

type AddBoard = { title: string; slug: string };
export async function addBoard({ title, slug }: AddBoard) {
  const { data, error } = await supabase
    .from("boards")
    .insert([{ title, slug, userId: USER_ID }])
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error("Ops... Something went wrong!");
  return data;
}
