"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BsKanban } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";

import { BoardType, UserType, UserVerifyType } from "@/lib/types";
import { getBoardByUserId } from "@/lib/actions";

import SideMenuItem from "./SideMenuItem";
import NewBoard from "./NewBoard";
import { useUserContext } from "@/context/user-context";
import { User } from "@supabase/supabase-js";

export default function Sidebar({ user }: { user: UserType }) {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const queryClient = useQueryClient();

  useEffect(
    function () {
      async function fetchBoards() {
        if (!user) return;

        const data = (await getBoardByUserId()) as BoardType[];
        setBoards(data);

        queryClient.setQueryData(["boards"], data);
      }
      fetchBoards();
    },
    [user, queryClient]
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
            <h2 className="text-center py-4 text-xl font-semibold">Boards</h2>
            {!boards?.length && (
              <h2 className="text-center">No Board Found.</h2>
            )}
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
              <NewBoard boards={boards} user={user} />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
