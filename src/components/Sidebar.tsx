"use client";
import Link from "next/link";
import { BsKanban } from "react-icons/bs";

import SideMenuItem from "./SideMenuItem";

import { BoardType } from "@/lib/types";

import { getBoards } from "@/lib/fncs";
import NewBoard from "./NewBoard";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/user-context";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const queryClient = useQueryClient();

  const { user } = useUserContext();

  useEffect(
    function () {
      async function fetchBoards() {
        if (!user?.id) return;

        const { boards: data } = await getBoards(user.id);

        setBoards(data);

        queryClient.setQueryData(["boards"], data);
      }
      fetchBoards();
    },
    [user, user?.id, queryClient]
  );

  return (
    <aside className="grid-row-full border-r inline-grid text-zinc-50">
      <div className="flex flex-col">
        <div className="flex gap-4 items-center justify-center h-32 text-4xl">
          <BsKanban />
          <Link href="/" className=" font-semibold">
            KANBAN
          </Link>
        </div>

        {user && (
          <>
            <p className="text-center text-zinc-300 py-5">
              Boards ({boards?.length})
            </p>
            {!boards?.length && <h2>No Board Found.</h2>}
            {boards?.length > 0 && (
              <nav className="pr-12 flex flex-col gap-2">
                <menu>
                  {boards?.map((item) => (
                    <SideMenuItem
                      key={item.id}
                      title={item.title}
                      href={item.slug}
                      id={item.id}
                    />
                  ))}
                </menu>
              </nav>
            )}
            <div className="p-4">
              <NewBoard boards={boards} />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
