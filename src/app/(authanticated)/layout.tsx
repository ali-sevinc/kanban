import type { Metadata } from "next";
import { Kanit } from "next/font/google";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Provider from "@/utils/Provider";

import "./globals.css";
import UserContextProvider from "@/context/user-context";
import { verifyAuth } from "@/lib/auth";
import { getUser } from "@/lib/actions";

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
  const user = await verifyAuth();
  const userDetails = await getUser(user.user?.id || "");

  return (
    <html lang="en">
      <body className={kanit.className}>
        <Provider>
          <UserContextProvider>
            <div className="grid grid-cols-[20rem,1fr] grid-rows-[auto,1fr] h-screen bg-zinc-800">
              <Header user={user} userDetails={userDetails} />
              <Sidebar user={user} />
              <main className="overflow-y-scroll flex-grow px-4 py-2 text-zinc-50">
                {children}
              </main>
            </div>
          </UserContextProvider>
        </Provider>
      </body>
    </html>
  );
}
