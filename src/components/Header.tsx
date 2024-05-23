"use client";

import { usePathname } from "next/navigation";
import TextButton from "./TextButton";

import { BoardType } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchBoards } from "@/lib/fncs";
import Modal from "./Modal";
import NewTodo from "./NewTodo";

export default function Header() {
  const pathName = usePathname();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [boards, setBoards] = useState<BoardType[]>([]);

  useEffect(function () {
    async function handleFetchBoards() {
      const fetchedBoards = await fetchBoards();

      setBoards(fetchedBoards);
    }
    handleFetchBoards();
  }, []);

  const board = boards.find((board) => board.slug === pathName);

  let displayName = "";
  if (pathName === "/") displayName = "home";
  if (pathName !== "/")
    displayName = boards.find((item) => item.slug === pathName)?.title || "";

  return (
    <>
      <header className="h-24 text-zinc-50 flex items-center justify-between px-12 border-b">
        <h2 className="uppercase">{displayName}</h2>
        {pathName !== "/" && (
          <TextButton onClick={() => setShowNewTodo(true)}>
            +New Todo
          </TextButton>
        )}
      </header>
      {showNewTodo && board && (
        <Modal open={showNewTodo} onClose={() => setShowNewTodo(false)}>
          <NewTodo board={board} onClose={() => setShowNewTodo(false)} />
        </Modal>
      )}
    </>
  );
}
