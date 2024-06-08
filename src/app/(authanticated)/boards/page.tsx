import Board from "@/components/Board";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await verifyAuth();
  if (!user.user || !user.session) {
    return redirect("/auth/login");
  }
  return <Board slug="" user={user} />;
}
