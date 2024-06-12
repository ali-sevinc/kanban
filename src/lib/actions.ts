"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { supabase } from "./supabase";
import { createUser, getUserByEmail, getUserById } from "./user";
import { hashPassword, verifyPassword } from "./hash";
import { createAuthSession, deleteSession } from "./auth";

import { BoardType, ProgressType, TaskType } from "./types";
import { createNewBoard, deleteBoardById, getBoards } from "./board";
import {
  deleteTaskById,
  getTasksByBoardId,
  newTask,
  updateTaskById,
} from "./tasks";
import { uploadImage } from "./cloudinary";

//AUTHANTICATION ACTIONS
type AuthCredentialsType = {
  email: string;
  password: string;
  name?: string;
  image?: string;
};
export async function signup({
  email,
  password,
  name,
  image,
}: AuthCredentialsType) {
  const hashedPassword = hashPassword(password);
  try {
    if (!email || !password || !name || !image) return;

    const userId = createUser(email, hashedPassword, name, image);

    const id = userId.toString();
    await createAuthSession(id);
    redirect("/");
  } catch (error) {
    const dbError = error as { code: string; message: string };
    if (dbError?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return "Account cannot created.";
    }
    throw error;
  }
}

export async function login({ email, password }: AuthCredentialsType) {
  const user = getUserByEmail(email);
  try {
    if (!user) {
      throw new Error("Could not login. Plase check your credentials.");
    }

    const isPasswordValid = verifyPassword(user.password, password);

    if (!isPasswordValid) {
      throw new Error("Could not login. Plase check your credentials.");
    }

    await createAuthSession(user.id.toString());
    redirect("/");
  } catch (error) {
    throw new Error("Could not login. Plase check your credentials.");
  }
}

export async function logout() {
  await deleteSession();
}

export async function getUser(id: string) {
  return getUserById(id);
}

//BOARDS ACTIONS
export async function createBoard({
  title,
  slug,
  user_id,
}: {
  title: string;
  slug: string;
  user_id: string;
}) {
  const res = createNewBoard({ title, slug, user_id });
  revalidatePath("/");
  return res;
}

export async function getBoardByUserId(id: string) {
  const res = getBoards(id);
  return res as BoardType[];
}

export async function deleteBoard(id: number) {
  deleteBoardById(id);
  revalidatePath("/");
  redirect("/boards");
}

// TASKS ACTIONS

export async function getTasks(board_id: string) {
  const tasks = getTasksByBoardId(board_id);
  revalidatePath("/");
  return tasks as TaskType[];
}
export async function updateTask(taskId: number, progress: ProgressType) {
  const res = updateTaskById({ id: taskId, progress });

  revalidatePath("/");

  return res;
}

type AddTodoType = {
  title: string;
  body: string;
  progress: ProgressType;
  board_id: string;
};
export async function addTodo(task: AddTodoType) {
  const res = newTask(task);
  revalidatePath("/");

  return res;
}

export async function deleteTask(id: number) {
  try {
    deleteTaskById(id);
    revalidatePath("/");
  } catch (error) {}
}
