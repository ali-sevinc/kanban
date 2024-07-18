import db from "./db";
import supabase from "./supabase";

export function createNewBoard({
  title,
  slug,
  user_id,
}: {
  title: string;
  slug: string;
  user_id: string;
}) {
  const res = db
    .prepare("INSERT INTO boards (title, slug, user_id) VALUES (?, ?, ?)")
    .run(title, slug, user_id);

  return res;
}

export function getBoards(id: string) {
  const res = db.prepare("SELECT * FROM boards WHERE user_id = ?").all(id);
  return res;
}

export function deleteBoardById(id: number) {
  const res = db.prepare("DELETE FROM boards WHERE id = ?").run(id);
  return res;
}

/****************************************************************** */

export async function createNewBoardSupabase({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) throw new Error("User not found.");
    const { data, error } = await supabase
      .from("boards")
      .insert([{ title, slug, user_id: user.id }])
      .select();
    if (error) throw new Error("Board could not created.");
    return data;
  } catch (error) {}
}

export async function getBoardSupabase() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", user?.id);
    if (error) throw new Error("Board could not fetched");
    return data;
  } catch (error) {}
}

export async function deleteBoardSupabase(id: number) {
  try {
    let { error } = await supabase.from("boards").delete().eq("id", id);
    if (error) throw new Error("Board could not fetched");
  } catch (error) {}
}
