import { createClient } from "@/utils/supabase/server";
import supabase from "./supabase";

export async function createNewBoardSupabase({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const supabaseServer = createClient();
  try {
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

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
  const supabaseServer = createClient();
  try {
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
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
