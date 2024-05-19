"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenuItem({ name }: { name: string }) {
  const pathName = usePathname();

  const isSelected = name.toLowerCase() === pathName.split("/", -1).join("");

  return (
    <li
      className={`${
        isSelected ? "bg-purple-500 rounded-r-full translate-x-2" : ""
      } px-4 py-1 text-lg hover:translate-x-2 duration-200`}
    >
      <Link
        href={`/${name.toLocaleLowerCase()}`}
        className="w-full inline-block capitalize"
      >
        {name}
      </Link>
    </li>
  );
}
