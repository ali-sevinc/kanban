"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export async function fetchTasks() {
//   const res = await fetch(`http://localhost:8000/tasks`, { cache: "no-cache" });
//   const data = await res.json();
//   return data;
// }

// export async function fetchBoards() {
//   const res = await fetch(`http://localhost:8000/boards`, {
//     cache: "no-cache",
//   });
//   const data = await res.json();
//   return data;
// }

export async function fetchBoards(slug?: string) {
  let data;
  if (!slug) {
    const res = await fetch(`http://localhost:8000/boards`, {
      cache: "no-cache",
    });
    data = await res.json();
  } else {
    const res = await fetch(`http://localhost:8000/boards/?slug=${slug}`, {
      cache: "no-cache",
    });
    data = await res.json();
  }

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
    tasks: [],
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

export async function deleteBoard(id: string) {
  const res = await fetch(`http://localhost:8000/boards/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (res.ok) {
    revalidatePath("", "page");
    redirect("/");
  }
}
