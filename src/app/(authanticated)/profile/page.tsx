import Profile from "@/components/Profile";
import { getBoardByUserId, getUser } from "@/lib/actions";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const isAuth = await verifyAuth();
  if (!isAuth.user || !isAuth.session) redirect("/auth/login");

  const user = await getUser(isAuth.user.id);
  const boards = await getBoardByUserId(isAuth.user.id);

  return <Profile user={user} boards={boards} />;
}
