import db from "./db";
import supabase from "./supabase";
import { ProgressType } from "./types";

export function getTasksByBoardId(board_id: string) {
  const res = db
    .prepare("SELECT * FROM tasks WHERE board_id = ?")
    .all(board_id);
  return res;
}

type NewTaskType = {
  board_id: number;
  body: string;
  progress: ProgressType;
  title: string;
};
export function newTask({ board_id, body, progress, title }: NewTaskType) {
  const res = db
    .prepare(
      "INSERT INTO tasks (title, body, progress, board_id) VALUES (?, ?, ?, ?)"
    )
    .run(title, body, progress, board_id);
  return res;
}

export function updateTaskById({
  id,
  progress,
}: {
  id: number;
  progress: ProgressType;
}) {
  const res = db
    .prepare("UPDATE tasks SET progress = ? WHERE id = ?")
    .run(progress, id);

  return res;
}

export function deleteTaskById(id: number) {
  const res = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  return res;
}

/* ****************************************************************************** */
export async function getTasksSupabase(board_id: number) {
  try {
    let { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("board_id", board_id);

    if (error) throw new Error("Tasks could not fetched.");
    return tasks;
  } catch (error) {
    console.error("Error");
  }
}
export async function newTaskSupabase({
  board_id,
  body,
  progress,
  title,
}: NewTaskType) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, body, progress, board_id }])
      .select();
    if (error) throw new Error("Task could not created.");
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function updateTaskSupabase(id: number, progress: ProgressType) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ progress })
      .eq("id", id)
      .select();
    if (error) throw new Error("Failed to update.");
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteTaskSupabase(id: number) {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error("Failed to delete task.");
  } catch (error) {
    console.error(error);
  }
}
