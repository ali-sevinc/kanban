import type { Metadata } from "next";
import { Kanit } from "next/font/google";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
        className={`grid grid-cols-[20rem,1fr] grid-rows-[auto,1fr] h-screen bg-zinc-800 ${kanit.className}`}
      >
        <Header boards={[]} />
        <Sidebar />
        <main className="overflow-y-scroll flex-grow px-4 py-2 text-zinc-50">
          {children}
        </main>
      </body>
    </html>
  );
}
