"use client";

import { usePathname } from "next/navigation";
import TextButton from "./TextButton";

import { BoardType } from "@/lib/types";

export default function Header({ boards }: { boards: BoardType[] }) {
  const pathName = usePathname();

  let displayName = "";
  if (pathName === "/") displayName = "home";
  if (pathName !== "/")
    displayName = boards.find((item) => item.slug === pathName)?.title || "";

  return (
    <header className="h-24 text-zinc-50 flex items-center justify-between px-12 border-b">
      <h2 className="uppercase">{displayName}</h2>
      <TextButton>+New Todo</TextButton>
    </header>
  );
}
