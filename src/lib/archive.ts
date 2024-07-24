// import db from "./db";
// import supabase from "./supabase";

// export function addToArchive({
//   title,
//   body,
//   progress,
//   board_name,
//   user_id,
// }: AddType) {
//   const res = db
//     .prepare(
//       "INSERT INTO archive (title, body, progress, board_name, user_id) VALUES (?, ?, ?, ?, ?)"
//     )
//     .run(title, body, progress, board_name, user_id);

//   return res;
// }

// export function getArchiveByUserId(user_id: string) {
//   const res = db
//     .prepare("SELECT * FROM archive WHERE user_id = ?")
//     .all(user_id);
//   return res;
// }

// export function deleteArchiveById(id: number) {
//   db.prepare("DELETE FROM archive WHERE id = ?").run(id);
// }

import { createClient } from "@/utils/supabase/server";

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
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  const supabase = createClient();
  const { error } = await supabase.from("archive").delete().eq("id", id);
}
