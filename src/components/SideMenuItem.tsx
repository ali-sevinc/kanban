"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { HiX } from "react-icons/hi";
import Modal from "./Modal";
import Button from "./Button";

import { deleteBoard } from "@/lib/actions";
import { AnimatePresence } from "framer-motion";

type PropssType = { title: string; href: string; id: number };

export default function SideMenuItem({ title, href, id }: PropssType) {
  const [showConfirm, setShowConfirm] = useState(false);

  const pathName = usePathname();

  const isSelected = href === pathName.slice(1);

  async function handleDelete(id: number) {
    setShowConfirm(false);
    await deleteBoard(id);
  }

  return (
    <>
      <motion.li
        layout
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className={`${
          isSelected ? "bg-purple-500 rounded-r-full" : ""
        } px-4 py-1 text-lg duration-200 flex items-center gap-5`}
      >
        <Link
          href={href}
          className="w-full inline-block capitalize hover:translate-x-2 duration-200"
        >
          {title}
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="duration-200 hover:bg-red-500 rounded-full"
        >
          <HiX />
        </button>
      </motion.li>
      <AnimatePresence mode="wait">
        {showConfirm && (
          <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
            <div className="text-zinc-50">
              <h2 className="text-2xl pb-4">Are you sure?</h2>
              <p className="text-lg">
                Do you really want to delete{" "}
                <b className="text-red-300">
                  &rdquo;{title.toUpperCase()}&rdquo;
                </b>{" "}
                board and all the tasks?
              </p>
              <p className="text-center text-red-300">
                This action cannot be undone!!
              </p>
              <div className="flex items-center justify-center gap-8 pt-8">
                <Button model="secondary" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button model="danger" onClick={() => handleDelete(id)}>
                  Proceed
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
