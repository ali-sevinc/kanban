"use client";

import { ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};
export default function TextButton({
  children,
  onClick = () => {},
  type = "button",
}: PropsType) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="text-purple-400 text-lg hover:translate-x-2 hover:text-purple-500 duration-200"
    >
      {children}
    </button>
  );
}
