import supabase from "./supabase";
import { ProgressType } from "./types";
import { createClient } from "@/utils/supabase/server";

type NewTaskType = {
  board_id: number;
  body: string;
  progress: ProgressType;
  title: string;
};
export async function getTasksSupabase(board_id: number) {
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user?.id) return;
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
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user?.id) return;
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
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user?.id) return;
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
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user?.id) return;
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error("Failed to delete task.");
  } catch (error) {
    console.error(error);
  }
}
