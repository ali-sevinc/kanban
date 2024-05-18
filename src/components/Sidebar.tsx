import Link from "next/link";
import { BsKanban } from "react-icons/bs";
import SideMenuItem from "./SideMenuItem";

const DUMMY_BOARDS = [
  { id: "1", name: "Tasks" },
  { id: "2", name: "Financials" },
  { id: "3", name: "Roadmap" },
];

export default function Sidebar() {
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
          Boards ({DUMMY_BOARDS.length})
        </p>
        <menu className="pr-12 flex flex-col gap-2">
          {DUMMY_BOARDS.map((item) => (
            <SideMenuItem key={item.id} name={item.name} />
          ))}
        </menu>
      </div>
    </aside>
  );
}
