"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { supabase } from "./supabase";
import {
  changeImage,
  changeName,
  changePassword,
  createUser,
  getUserByEmail,
  getUserById,
} from "./user";
import { hashPassword, verifyPassword } from "./hash";
import { createAuthSession, deleteSession } from "./auth";

import { ArchiveType, BoardType, ProgressType, TaskType } from "./types";
import { createNewBoard, deleteBoardById, getBoards } from "./board";
import {
  deleteTaskById,
  getTasksByBoardId,
  newTask,
  updateTaskById,
} from "./tasks";
import { deleteImage, uploadImage } from "./cloudinary";
import { addToArchive, deleteArchiveById, getArchiveByUserId } from "./archive";

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

  if (!email || !password || !name || !image)
    return {
      error: "Cannot signup. Please check your credantials.",
    };

  const userId = createUser(email, hashedPassword, name, image);

  const id = userId.toString();

  await createAuthSession(id);
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
}

export async function logout() {
  await deleteSession();
}

export async function getUser(id: number) {
  return getUserById(id);
}

//UPDATE USER
export async function updateImageById(imageUrl: string, id: number) {
  const user = await getUser(id);

  if (!user.id) return;

  const publicId = "kanban" + user.image.split("/kanban")[1].split(".")[0];

  if (!publicId) return;

  await deleteImage(publicId);

  const res = changeImage(imageUrl, id);
  revalidatePath("/");
  return res;
}
export async function updateNameById(name: string, id: number) {
  const res = changeName(name, id);
  revalidatePath("/");
  return res;
}
export async function updatePasswordById(password: string, id: number) {
  const hashedPassword = hashPassword(password);
  const res = changePassword(hashedPassword, id);
  revalidatePath("/");
  return res;
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

//ARCHIVE ACTIONS
type AddArchiveType = {
  title: string;
  body: string;
  progress: ProgressType;
  board_name: string;
  user_id: string;
};
export async function createArchive(data: AddArchiveType) {
  const res = addToArchive(data);
  revalidatePath("/");
  return res;
}

export async function fetchArchive(user_id: string) {
  const res = getArchiveByUserId(user_id);
  return res as ArchiveType[];
}

export async function deleteArchive(id: number) {
  const res = deleteArchiveById(id);
  revalidatePath("/");
  return res;
}
