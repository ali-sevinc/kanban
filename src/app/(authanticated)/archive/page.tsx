import Archive from "@/components/Archive";
import { fetchArchive } from "@/lib/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  const archive = await fetchArchive();

  return <Archive archive={archive} />;
}
