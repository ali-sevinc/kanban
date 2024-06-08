"use client";

import { usePathname } from "next/navigation";
import TextButton from "./TextButton";

import { BoardType, UserType } from "@/lib/types";
import { useEffect, useState } from "react";
import { getBoards, logout } from "@/lib/fncs";
import Modal from "./Modal";
import NewTodo from "./NewTodo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Header({ user }: { user: UserType }) {
  const pathName = usePathname();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [boards, setBoards] = useState<BoardType[] | undefined>([]);

  const queryClient = useQueryClient();

  const board = boards?.find((board) => board.slug === pathName.slice(1)) || [];

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
          {pathName !== "/" && user.user && user.session && (
            <TextButton onClick={() => setShowNewTodo(true)}>
              +New Todo
            </TextButton>
          )}
          {!user.user && !user.session ? (
            <Link href="/auth/login">Login</Link>
          ) : (
            <form action={logout}>
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
