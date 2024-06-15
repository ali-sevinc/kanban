import Archive from "@/components/Archive";
import { fetchArchive } from "@/lib/actions";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
  const user = await verifyAuth();
  if (!user.user || !user.session) {
    return redirect("/auth/login");
  }
  const archive = await fetchArchive(user.user.id);

  return <Archive archive={archive} />;
}
