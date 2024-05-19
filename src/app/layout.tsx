import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import "./globals.css";

const MPlus = M_PLUS_Rounded_1c({
  weight: ["400", "500", "900", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban",
  description: "Track your tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`grid grid-cols-[20rem,1fr] grid-rows-[auto,1fr] h-screen bg-zinc-800 ${MPlus.className}`}
      >
        <Header />
        <Sidebar />
        <main className="overflow-y-scroll flex-grow px-4 py-2 text-zinc-50">
          {children}
        </main>
      </body>
    </html>
  );
}
