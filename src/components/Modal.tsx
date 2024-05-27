"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type PropsType = { open: boolean; onClose: () => void; children: ReactNode };
export default function Modal({ open, onClose, children }: PropsType) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(
    function () {
      if (!ref.current) return;
      if (open) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    },
    [open]
  );

  return createPortal(
    <motion.dialog
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      ref={ref}
      onClose={onClose}
      className="backdrop:bg-zinc-900/70 bg-zinc-600 border border-zinc-300 rounded-lg p-4"
    >
      {children}
    </motion.dialog>,
    document.body
  );
}
