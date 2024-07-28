import { ReactNode } from "react";
import type { Metadata } from "next";

import { Kanit } from "next/font/google";

import "./globals.css";
import Provider from "@/utils/Provider";
import HomeHeader from "@/components/HomeHeader";
// import UserProvider from "@/context/user-context";
import { createClient } from "@/utils/supabase/server";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kanban",
  description: "Track your tasks.",
};

export default async function layout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={kanit.className}>
        <Provider>
          {/* <UserProvider> */}
          <div className="h-screen bg-zinc-800 text-zinc-50">
            <HomeHeader user={user} />
            <div>{children}</div>
          </div>
          {/* </UserProvider> */}
        </Provider>
      </body>
    </html>
  );
}
