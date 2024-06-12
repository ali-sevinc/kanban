import Login from "@/components/Auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { mode: string };
}) {
  let mode: "login" | "signup" = "login";
  if (searchParams.mode === "signup") mode = "signup";

  return <Login mode={mode} />;
}
