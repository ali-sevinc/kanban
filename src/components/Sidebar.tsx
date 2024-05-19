import Link from "next/link";
import { BsKanban } from "react-icons/bs";
import SideMenuItem from "./SideMenuItem";
import { fetchData } from "@/app/[board]/page";

// const DUMMY_BOARDS = [
//   { id: "1", name: "Tasks" },
//   { id: "2", name: "Financials" },
//   { id: "3", name: "Roadmap" },
// ];

export default function Sidebar() {
  const data = fetchData();
  const boards = data.reduce((sum, item) => {
    if (!sum.includes(item.type)) {
      sum.push(item.type);
    }
    return sum;
  }, [] as string[]);

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
        <menu className="pr-12 flex flex-col gap-2">
          {boards.map((item) => (
            <SideMenuItem key={item} name={item} />
          ))}
        </menu>
      </div>
    </aside>
  );
}
