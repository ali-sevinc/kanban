"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
    <dialog
      ref={ref}
      onClose={onClose}
      className="backdrop:bg-zinc-900/70 bg-zinc-600 border border-zinc-300 rounded-lg p-4"
    >
      {children}
    </dialog>,
    document.body
  );
}
