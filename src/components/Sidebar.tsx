import Link from "next/link";
import { BsKanban } from "react-icons/bs";
import SideMenuItem from "./SideMenuItem";

import { BoardType } from "@/lib/types";

import { fetchBoards } from "@/lib/fncs";
import NewBoard from "./NewBoard";

export default async function Sidebar() {
  const boards = (await fetchBoards()) as BoardType[];

  return (
    <aside className="grid-row-full border-r inline-grid text-zinc-50">
      <div className="flex flex-col">
        <div className="flex gap-4 items-center justify-center h-32 text-4xl">
          <BsKanban />
          <Link href="/" className=" font-semibold">
            KABAN
          </Link>
        </div>
        <p className="text-center text-zinc-300 py-5">
          Boards ({boards.length})
        </p>
        <nav className="pr-12 flex flex-col gap-2">
          <menu>
            {boards.map((item) => (
              <SideMenuItem
                key={item.boardId}
                title={item.title}
                href={item.slug}
                id={item.id}
              />
            ))}
          </menu>
        </nav>
        <div className="p-4">
          <NewBoard boards={boards} />
        </div>
      </div>
    </aside>
  );
}
