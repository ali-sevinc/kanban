"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { BoardType, UserType } from "@/lib/types";
import { getBoardByUserId, logout } from "@/lib/actions";

import TextButton from "./TextButton";
import Modal from "./Modal";
import NewTodo from "./NewTodo";
import Link from "next/link";

export default function Header({ user }: { user: UserType }) {
  const pathName = usePathname();
  const router = useRouter();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [boards, setBoards] = useState<BoardType[] | undefined>([]);

  useEffect(
    function () {
      async function fetchBoards() {
        if (!user.user) return;
        const res = await getBoardByUserId(user.user?.id);
        setBoards(res);
      }
      fetchBoards();
    },
    [user.user]
  );

  const board = boards?.find((board) => board.slug === pathName.slice(1));

  let displayName = "";
  if (pathName === "/") displayName = "home";
  if (pathName !== "/")
    displayName =
      boards?.find((item) => item.slug === pathName.slice(1))?.title || "";

  return (
    <>
      <header className="h-24 text-zinc-50 flex items-center justify-between px-12 border-b">
        <h2 className="uppercase">{displayName}</h2>
        <div className="flex gap-4">
          {pathName !== "/" &&
            user.user &&
            user.session &&
            pathName !== "/boards" && (
              <TextButton onClick={() => setShowNewTodo(true)}>
                +New Todo
              </TextButton>
            )}
          {!user.user && !user.session ? (
            <Link href="/auth/login">Login</Link>
          ) : (
            <form
              action={() => {
                logout();
                router.push("/");
              }}
            >
              <TextButton type="submit">Logout</TextButton>
            </form>
          )}
        </div>
      </header>
      <AnimatePresence mode="wait">
        {showNewTodo && board && (
          <Modal open={showNewTodo} onClose={() => setShowNewTodo(false)}>
            <NewTodo board={board} onClose={() => setShowNewTodo(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
