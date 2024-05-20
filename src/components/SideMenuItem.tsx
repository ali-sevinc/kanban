"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PropssType = { title: string; href: string };

export default function SideMenuItem({ title, href }: PropssType) {
  const pathName = usePathname();

  const isSelected = href === pathName;

  return (
    <li
      className={`${
        isSelected ? "bg-purple-500 rounded-r-full translate-x-2" : ""
      } px-4 py-1 text-lg hover:translate-x-2 duration-200`}
    >
      <Link href={href} className="w-full inline-block capitalize">
        {title}
      </Link>
    </li>
  );
}
