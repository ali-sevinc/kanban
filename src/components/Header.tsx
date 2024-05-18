"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();

  let displayName = "";
  if (pathName === "/") displayName = "HOME";
  if (pathName !== "/")
    displayName = pathName.split("/", -1).join("").toUpperCase();

  return (
    <header className="h-24 text-zinc-50 flex items-center justify-between px-12 border-b">
      <h2>{displayName}</h2>
      <button>+Add New Task</button>
    </header>
  );
}
