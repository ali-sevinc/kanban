import type { Metadata } from "next";
import { Kanit } from "next/font/google";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Provider from "@/utils/Provider";

import "./globals.css";
// import { verifyAuth } from "@/lib/auth";
import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import UserProvider from "@/context/user-context";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kanban",
  description: "Track your tasks.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        <Provider>
          <UserProvider>
            <div className="grid grid-cols-[20rem,1fr] grid-rows-[auto,1fr] h-screen bg-zinc-800">
              <Header />
              <Sidebar />
              <main className="overflow-y-scroll flex-grow px-4 py-2 text-zinc-50">
                {children}
              </main>
            </div>
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}
