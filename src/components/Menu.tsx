"use client";

import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useState,
} from "react";
import useOutsideClick from "./useOutsideClick";

type PositionType = null | { x: number; y: number };
type InitialType = {
  name: string;
  position: PositionType;
  open: (name: string) => void;
  close: () => void;
  onPosition: (pos: { x: number; y: number }) => void;
};
const initialState: InitialType = {
  name: "",
  position: null,
  open: () => {},
  close: () => {},
  onPosition: () => {},
};

const MenuContext = createContext(initialState);

export default function MenuProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState<PositionType>(null);

  function open(openName: string) {
    setName(openName);
  }
  function close() {
    setName("");
  }
  function onPosition(pos: { x: number; y: number }) {
    setPosition(pos);
  }

  return (
    <MenuContext.Provider value={{ name, open, close, onPosition, position }}>
      {children}
    </MenuContext.Provider>
  );
}

function Menu({ children }: { children: ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}

function Toggle({
  openName,
  children,
}: {
  openName: string;
  children: ReactNode;
}) {
  const { close, name, onPosition, open } = useContext(MenuContext);

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    const rect = (event.target as HTMLElement)
      .closest("button")!
      ?.getBoundingClientRect();

    onPosition({
      x: window.innerWidth - rect?.width - rect.x - rect.width / 4,
      y: rect.y + rect.height + 5,
    });

    name === "" || name !== openName ? open(openName) : close();
  }

  return <button onClick={handleClick}>{children}</button>;
}

function List({
  children,
  openName,
}: {
  children: ReactNode;
  openName: string;
}) {
  const { name, position, close } = useContext(MenuContext);

  const ref = useOutsideClick(close, false) as RefObject<HTMLUListElement>;

  if (name !== openName) return null;

  return (
    <ul
      ref={ref}
      style={{ right: position?.x, top: position?.y }}
      className="fixed z-10 bg-zinc-50 text-zinc-800 py-2 rounded-sm px-1"
    >
      {children}
    </ul>
  );
}

type ItemType = { children: ReactNode; onClick?: () => void };
function Item({ children, onClick }: ItemType) {
  const { close } = useContext(MenuContext);
  function handleClick() {
    onClick && onClick();
    close();
  }

  return (
    <li className="hover:bg-zinc-300 duration-200 px-2">
      <button onClick={handleClick} className="w-full">
        {children}
      </button>
    </li>
  );
}

MenuProvider.Menu = Menu;
MenuProvider.Toggle = Toggle;
MenuProvider.List = List;
MenuProvider.Item = Item;
