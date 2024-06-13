"use client";

import { useRef, useEffect } from "react";
export default function useOutsideClick(
  close: () => void,
  listenCapturing: boolean = true
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref?.current && !ref.current.contains(e.target as Node)) {
          // console.log("Clicked outside");
          close();
        }
      }
      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [close, listenCapturing]
  );

  return ref;
}
