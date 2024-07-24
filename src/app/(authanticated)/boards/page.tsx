import Home from "@/components/Home";
import { createClient } from "@/utils/supabase/server";
// import { verifyAuth } from "@/lib/auth";
// import supabase from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("[BOARDS PAGE]", user?.aud);
  if (!user?.id) {
    redirect("/auth/login");
  }

  return <Home />;
}
