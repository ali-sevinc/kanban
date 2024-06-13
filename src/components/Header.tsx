"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { BoardType, UserType, UserVerifyType } from "@/lib/types";
import { getBoardByUserId, getUser, logout } from "@/lib/actions";

import TextButton from "./TextButton";
import Modal from "./Modal";
import NewTodo from "./NewTodo";
import Link from "next/link";
import MenuProvider from "./Menu";

export default function Header({
  user,
  userDetails,
}: {
  user: UserVerifyType;
  userDetails: UserType;
}) {
  const pathName = usePathname();
  const router = useRouter();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [boards, setBoards] = useState<BoardType[] | undefined>([]);

  const [loggedUser, setLoggedUser] = useState<UserType | null>(null);

  useEffect(
    function () {
      async function fetchBoards() {
        if (!user.user) return;
        const logged = await getUser(user.user.id);
        const res = await getBoardByUserId(user.user?.id);
        setLoggedUser(logged);
        setBoards(res);
      }
      fetchBoards();
    },
    [user.user]
  );

  const board = boards?.find((board) => board.slug === pathName.slice(1));
  console.log(userDetails);

  let displayName = "";
  if (pathName === "/boards")
    displayName = `Welcome ${loggedUser?.name}` || "Home";
  if (pathName !== "/boards")
    displayName =
      boards?.find((item) => item.slug === pathName.slice(1))?.title || "";

  return (
    <>
      <header className="h-24 text-zinc-50 flex items-center justify-between px-12 border-b">
        <h2 className="uppercase">{displayName}</h2>
        <div className="flex gap-4">
          {pathName !== "/" &&
            user.user &&
            user.session &&
            pathName !== "/boards" && (
              <TextButton onClick={() => setShowNewTodo(true)}>
                +New Todo
              </TextButton>
            )}
          {!user.user && !user.session ? (
            <Link href="/auth/login">Login</Link>
          ) : (
            <MenuProvider>
              <MenuProvider.Toggle openName="profile">
                <img
                  src={userDetails.image}
                  className="w-14 h-14 rounded-full p-1 border-2 object-cover"
                />
              </MenuProvider.Toggle>
              <MenuProvider.List openName="profile">
                <MenuProvider.Item>Profile</MenuProvider.Item>
                <MenuProvider.Item>Test-2</MenuProvider.Item>
                <MenuProvider.Item>Test-3</MenuProvider.Item>
                <MenuProvider.Item>Test-4 qasdqweasd</MenuProvider.Item>
                <MenuProvider.Item onClick={() => logout()}>
                  Logout
                </MenuProvider.Item>
              </MenuProvider.List>
            </MenuProvider>
          )}
        </div>
      </header>
      <AnimatePresence mode="wait">
        {showNewTodo && board && (
          <Modal open={showNewTodo} onClose={() => setShowNewTodo(false)}>
            <NewTodo board={board} onClose={() => setShowNewTodo(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
