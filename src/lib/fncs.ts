"use server";
import { redirect } from "next/navigation";
import { BoardType } from "./types";
import { revalidatePath } from "next/cache";

export async function fetchBoards(slug?: string) {
  let data: BoardType[];
  if (!slug) {
    const res = await fetch(`http://localhost:8000/boards`);
    data = await res.json();
  } else {
    const res = await fetch(`http://localhost:8000/boards/?slug=${slug}`);
    data = await res.json();
  }
  revalidatePath("/");
  return data as BoardType[];
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
    redirect("/");
  }
}

export async function addTodo(
  board: BoardType,
  task: { progress: string; body: string; title: string }
) {
  if (!board) throw new Error("Board not found.");
  const data = { ...board, tasks: [...board.tasks, task] };
  const res = await fetch(`http://localhost:8000/boards/${board.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create new todo.");
  const resData = await res.json();
  return resData;
}

export async function deleteTodo(boardId: string, todoId: string) {
  const boardsRes = await fetch(`http://localhost:8000/boards/${boardId}`);
  const board = (await boardsRes.json()) as BoardType;

  if (!board) {
    throw new Error("Not found");
  }

  const newBoard = {
    ...board,
    tasks: board.tasks.filter((todo) => todo.id !== todoId),
  };

  const res = await fetch(`http://localhost:8000/boards/${boardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBoard),
  });

  if (!res.ok) throw new Error("Progress cannot updated.");

  const data = await res.json();
  return data;
}

export async function updateTaskProgress(
  boardId: string,
  taskId: string,
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
