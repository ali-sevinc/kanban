"use server";
import { revalidatePath } from "next/cache";

export async function fetchTasks() {
  const res = await fetch(`http://localhost:8000/tasks`, { cache: "no-cache" });
  const data = await res.json();
  return data;
}

export async function fetchBoards() {
  const res = await fetch(`http://localhost:8000/boards`, {
    cache: "no-cache",
  });
  const data = await res.json();
  return data;
}

export async function createBoard({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const data = {
    title,
    slug,
    boardId: Math.random().toString(),
  };
  let resData;
  try {
    const res = await fetch("http://localhost:8000/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Creating board failed.");
    resData = await res.json();
    revalidatePath("", "page");
  } catch (error) {
    throw error;
  }
  return resData;
}
