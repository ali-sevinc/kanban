import { verifyAuth } from "@/lib/auth";
import { logout } from "@/lib/fncs";
import Link from "next/link";

export default async function HomeHeader() {
  const res = await verifyAuth();

  let isAuth = false;
  if (res.session && res.user) isAuth = true;

  return (
    <header className="w-[60%] mx-auto flex justify-between py-4 text-xl">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        {isAuth && <Link href="/boards">Boards</Link>}
      </div>
      {!isAuth && <Link href="/auth/login">Login</Link>}
      {isAuth && (
        <form action={logout}>
          <button>Logout</button>
        </form>
      )}
    </header>
  );
}