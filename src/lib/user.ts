import { createClient } from "@/utils/supabase/server";
import supabase from "./supabase";

export async function createUserSupabse(userData: {
  email: string;
  password: string;
  name?: string;
  image?: string;
}) {
  const supabaseServer = createClient();
  const { data, error: createError } = await supabaseServer.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (createError) throw new Error(createError.message);

  const { data: userInfo, error } = await supabase
    .from("users_info")
    .insert([
      {
        user_id: data.user?.id,
        name: userData.name,
        image: userData.image,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function loginSupabse(email: string, password: string) {
  const supabase = createClient();

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // console.log("[LOGIN SUPABASE]", data);

  if (error) throw new Error(error.message);

  return data;
}

export async function logoutSupabse() {
  const supabaseServer = createClient();
  let { error } = await supabaseServer.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserSupabase() {
  const supabaseServer = createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  if (!user?.id) return;

  try {
    let { data, error } = await supabase
      .from("users_info")
      .select("*")
      .eq("user_id", user?.id);

    if (error) throw new Error(error.message);
    return data?.[0] as {
      name: string;
      user_id: string;
      image: string;
      id: number;
    } | null;
  } catch (error) {
    throw new Error("Could not get user.");
  }
}
export async function changeImageSupabase(image: string, userId: string) {
  try {
    if (userId) throw new Error("User not found.");

    const { data, error } = await supabase
      .from("users_info")
      .update({ image })
      .eq("user_id", userId)
      .select();
    if (error) throw new Error("Failed to update image.");
  } catch (error) {
    console.error(error);
  }
}
export async function changeNameSupabase(newName: string) {
  const supabaseServer = createClient();
  try {
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user?.id) throw new Error("User not found.");

    const { data, error } = await supabase
      .from("users_info")
      .update({ name: newName })
      .eq("user_id", user.id)
      .select();
    if (error) throw new Error("Failed to update image.");
  } catch (error) {
    console.error(error);
  }
}
export async function changePasswordSupabase(newPassword: string) {
  const supabaseServer = createClient();
  try {
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();
    if (!user?.id) throw new Error("User not found.");

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error("Failed to change password.");
  } catch (error) {
    console.error(error);
  }
}
