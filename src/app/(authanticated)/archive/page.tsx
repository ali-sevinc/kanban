import Archive from "@/components/Archive";
import { fetchArchive } from "@/lib/actions";
// import { verifyAuth } from "@/lib/auth";
import supabase from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  const archive = await fetchArchive();

  return <Archive archive={archive} />;
}
