import Board from "@/components/Board";
import Home from "@/components/Home";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await verifyAuth();
  if (!user.user || !user.session) {
    return redirect("/auth/login");
  }
  return <Home />;
}
