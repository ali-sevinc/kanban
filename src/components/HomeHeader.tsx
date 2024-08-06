"use client";

import { logout } from "@/lib/actions";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function HomeHeader({ user }: { user: User | null }) {
  let isAuth = false;
  if (user) isAuth = true;

  return (
    <header className="w-[60%] mx-auto flex justify-between py-4 text-xl">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        {isAuth && (
          <>
            <Link href="/boards">Boards</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/profile">Profile</Link>
          </>
        )}
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
