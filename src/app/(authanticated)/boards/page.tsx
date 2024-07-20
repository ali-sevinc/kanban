import Home from "@/components/Home";
// import { verifyAuth } from "@/lib/auth";
import supabase from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  return <Home />;
}
