"use client";

import { usePathname } from "next/navigation";
import TextButton from "./TextButton";

import { BoardType } from "@/lib/types";
import { useEffect, useState } from "react";
import { getBoards } from "@/lib/fncs";
import Modal from "./Modal";
import NewTodo from "./NewTodo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useUserContext } from "@/context/user-context";
import Link from "next/link";

export default function Header() {
  const pathName = usePathname();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [boards, setBoards] = useState<BoardType[] | undefined>([]);

  const queryClient = useQueryClient();
  const { user, logout } = useUserContext();

  useEffect(
    function () {
      setBoards(() => queryClient.getQueryData(["boards"]));
    },
    [user, queryClient]
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
          {pathName !== "/" && user && (
            <TextButton onClick={() => setShowNewTodo(true)}>
              +New Todo
            </TextButton>
          )}
          {!user ? (
            <Link href="/auth/login">Login</Link>
          ) : (
            <TextButton onClick={logout}>Logout</TextButton>
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
