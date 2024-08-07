"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  changeImageSupabase,
  changeNameSupabase,
  changePasswordSupabase,
  createUserSupabse,
  getUserSupabase,
  loginSupabse,
  logoutSupabse,
} from "./user";

import { ArchiveType, BoardType, ProgressType, TaskType } from "./types";
import {
  createNewBoardSupabase,
  deleteBoardSupabase,
  getBoardSupabase,
} from "./board";
import {
  getTasksSupabase,
  deleteTaskSupabase,
  newTaskSupabase,
  updateTaskSupabase,
} from "./tasks";
import { deleteImage, uploadImage } from "./cloudinary";
import {
  addToArchiveSupabase,
  deleteArchiveSupabase,
  getArchiveSupabase,
} from "./archive";
import { createClient } from "@/utils/supabase/server";

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
  // const hashedPassword = hashPassword(password);

  if (!email || !password || !name || !image)
    return {
      error: "Cannot signup. Please check your credantials.",
    };

  // const userId = createUser(email, hashedPassword, name, image);
  try {
    const user = await createUserSupabse({ email, password, name, image });
    return user;
  } catch (error) {
    throw new Error("Could not create account. Please try again.");
  }
}

export async function login({ email, password }: AuthCredentialsType) {
  console.log("[LOGIN FUNCTION]");
  try {
    const user = await loginSupabse(email, password);
    console.log("[LOGIN FUNCTION]", user);
    return user;
  } catch (error) {
    console.log("[LOGIN FUNCTION ERROR]", error);

    throw new Error("Could not login.");
  }
}

export async function logout() {
  try {
    await logoutSupabse();
  } catch (error) {
    throw new Error("Could not logging out. Please try again later.");
  }
}

export async function getUser() {
  const user = await getUserSupabase();
  // console.log("GETUSER FUNCTION", user?.id);
  return user;
}

//UPDATE USER
export async function updateImageById(imageUrl: string) {
  const user = await getUser();

  if (!user?.id) return;

  const publicId = "kanban" + user.image.split("/kanban")[1].split(".")[0];

  if (!publicId) return;

  const res = await changeImageSupabase(imageUrl);

  if (!res?.length) return;

  await deleteImage(publicId);
  // const res = changeImage(imageUrl, user.id);
  revalidatePath("/");
  return res;
}

export async function updateNameById(name: string) {
  // const res = changeName(name, id);
  const res = await changeNameSupabase(name);
  revalidatePath("/");
  return res;
}
export async function updatePasswordById(
  email: string,
  currentPassword: string,
  password: string
) {
  const supabase = createClient();
  let { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: currentPassword,
  });

  if (error) {
    return {
      currentError: "Wrong Password",
    };
  }

  const res = await changePasswordSupabase(password);
  revalidatePath("/");
  return res;
}

//BOARDS ACTIONS
export async function createBoard({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  // const res = createNewBoard({ title, slug, user_id });
  const res = await createNewBoardSupabase({ title, slug });

  revalidatePath("/");
  return res;
}

export async function getBoardByUserId() {
  const res = await getBoardSupabase();
  // const res = getBoards(id);
  return res as BoardType[];
}

export async function deleteBoard(id: number) {
  // deleteBoardById(id);
  await deleteBoardSupabase(id);
  revalidatePath("/");
  redirect("/boards");
}

// TASKS ACTIONS
export async function getTasks(board_id: number) {
  // const tasks = getTasksByBoardId(board_id);
  const tasks = await getTasksSupabase(board_id);
  revalidatePath("/");
  return tasks as TaskType[];
}
export async function updateTask(taskId: number, progress: ProgressType) {
  // const res = updateTaskById({ id: taskId, progress });
  const res = await updateTaskSupabase(taskId, progress);

  revalidatePath("/");

  return res;
}

type AddTodoType = {
  board_id: number;
  body: string;
  progress: ProgressType;
  title: string;
};
export async function addTodo(task: AddTodoType) {
  // const res = newTask(task);
  const res = await newTaskSupabase(task);
  revalidatePath("/");
  return res;
}

export async function deleteTask(id: number) {
  try {
    await deleteTaskSupabase(id);
    // deleteTaskById(id);
    revalidatePath("/");
  } catch (error) {}
}

//ARCHIVE ACTIONS
type AddArchiveType = {
  title: string;
  body: string;
  progress: ProgressType;
  board_name: string;
};
export async function createArchive(data: AddArchiveType) {
  // const res = addToArchive(data);
  const res = await addToArchiveSupabase(data);
  revalidatePath("/");
  return res;
}

export async function fetchArchive() {
  // const res = getArchiveByUserId(user_id);
  const res = await getArchiveSupabase();
  return res as ArchiveType[];
}

export async function deleteArchive(id: number) {
  // const res = deleteArchiveById(id);
  const res = await deleteArchiveSupabase(id);
  revalidatePath("/");
  return res;
}
