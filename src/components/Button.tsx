"use client";

import { ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
  model?: "primary" | "secondary" | "danger";
};

const buttonStyle = {
  common: "border rounded font-semibold duration-200",
  primary: "bg-purple-500 hover:bg-purple-700",
  danger: "bg-red-500 hover:bg-red-700",
  secondary: "bg-zinc-700 hover:bg-zinc-900",
  small: "px-2 py-1 tracking-tighter text-sm",
  medium: "px-4 py-2 tracking-wide text",
  large: "px-5 py-2 tracking-widest text-lg",
};

export default function Button({
  children,
  onClick = () => {},
  type = "button",
  size = "medium",
  model = "primary",
}: PropsType) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${buttonStyle.common} ${buttonStyle[size]} ${buttonStyle[model]}`}
    >
      {children}
    </button>
  );
}
