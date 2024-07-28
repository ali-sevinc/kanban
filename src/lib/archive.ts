import { createClient } from "@/utils/supabase/server";
import supabase from "./supabase";

type AddType = {
  title: string;
  body: string;
  progress: "todo" | "doing" | "done";
  board_name: string;
};

export async function addToArchiveSupabase({
  board_name,
  body,
  progress,
  title,
}: AddType) {
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  try {
    if (!user?.id) throw new Error("User not found.");

    const { data, error } = await supabase
      .from("archive")
      .insert([{ title, body, progress, board_name, user_id: user.id }])
      .select();
    if (error) throw new Error("The task could not archived.");
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function getArchiveSupabase() {
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  try {
    if (!user?.id) throw new Error("User not found.");
    let { data, error } = await supabase
      .from("archive")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw new Error("Could not delete.");
    return data;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteArchiveSupabase(id: number) {
  const { error } = await supabase.from("archive").delete().eq("id", id);
}
