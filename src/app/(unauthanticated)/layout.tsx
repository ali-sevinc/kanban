import { ReactNode } from "react";
import type { Metadata } from "next";

import { Kanit } from "next/font/google";

import "./globals.css";
import Provider from "@/utils/Provider";
import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kanban",
  description: "Track your tasks.",
};

export default function layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        <Provider>
          <div className="h-screen bg-zinc-800 text-zinc-50">
            <HomeHeader />
            <div>{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
