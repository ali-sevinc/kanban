"use server";
import { redirect } from "next/navigation";
import { BoardType, ProgressType, TaskType } from "./types";
import { revalidatePath } from "next/cache";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const USER_ID = process.env.USER_ID;

// export async function fetchBoards(slug?: string) {
//   const { boards, error } = await getBoards();
//   // console.log(supabaseData);
//   return { boards, error } as { boards: BoardType[]; error: {} };
// }

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

// export async function createBoard({
//   title,
//   slug,
// }: {
//   title: string;
//   slug: string;
// }) {
//   const data = {
//     title,
//     slug,
//     boardId: Math.random().toString(),
//     tasks: [],
//   };
//   let resData;
//   try {
//     const res = await fetch("http://localhost:8000/boards", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error("Creating board failed.");
//     resData = await res.json();
//   } catch (error) {
//     throw error;
//   }
//   return resData;
// }

// export async function deleteBoard(id: number) {
//   const res = await fetch(`http://localhost:8000/boards/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();

//   if (res.ok) {
//     redirect("/");
//   }
// }

export async function addTodo(task: TaskType) {
  const { data, error } = await supabase.from("tasks").insert([task]).select();
  revalidatePath("/");
}

// export async function addTodo(
//   board: BoardType,
//   task: { progress: string; body: string; title: string }
// ) {
//   if (!board) throw new Error("Board not found.");
//   const data = { ...board, tasks: [...board.tasks, task] };
//   const res = await fetch(`http://localhost:8000/boards/${board.id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Failed to create new todo.");
//   const resData = await res.json();
//   return resData;
// }

export async function deleteTodo(id: number) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
}

// export async function deleteTodo(boardId: number, todoId: number) {
//   const boardsRes = await fetch(`http://localhost:8000/boards/${boardId}`);
//   const board = (await boardsRes.json()) as BoardType;

//   if (!board) {
//     throw new Error("Not found");
//   }

//   const newBoard = {
//     ...board,
//     tasks: board.tasks.filter((todo) => todo.id !== todoId),
//   };

//   const res = await fetch(`http://localhost:8000/boards/${boardId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newBoard),
//   });

//   if (!res.ok) throw new Error("Progress cannot updated.");

//   const data = await res.json();
//   return data;
// }

export async function updateTaskProgress(
  boardId: number,
  taskId: number,
  newProgress: "todo" | "doing" | "done"
) {
  const boardsRes = await fetch(`http://localhost:8000/boards/${boardId}`);
  const board = (await boardsRes.json()) as BoardType;

  // console.log("----Boards----", board);
  if (!board) {
    throw new Error("Not found");
  }

  const index = board.tasks.findIndex((task) => task.id === taskId);

  if (index === -1) throw new Error("Tasks not found!");

  board.tasks[index].progress = newProgress;

  const res = await fetch(`http://localhost:8000/boards/${boardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });

  if (!res.ok) throw new Error("Progress cannot updated.");

  const data = await res.json();
  return data;
}
