import Auth from "@/components/Auth";
import { verifyAuth } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { mode: string };
}) {
  let mode: "login" | "signup" = "login";
  if (searchParams.mode === "signup") mode = "signup";

  const user = await verifyAuth();

  return <Auth mode={mode} user={user.user} />;
}
