"use client";

import { Session, User } from "@supabase/supabase-js";
import { ReactNode, createContext, useContext, useState } from "react";

type InitialType = {
  user: null | { user: User; session: Session };
  handleLogin: (data: { user: User; session: Session }) => void;
  handleLogout: () => void;
};

const initialState: InitialType = {
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
};

const UserContext = createContext(initialState);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ user: User; session: Session } | null>(
    null
  );

  function handleLogin(userInfo: { user: User; session: Session }) {
    setUser(userInfo);
  }
  function handleLogout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("User-Context used outside of the UserProvider.");
  return context;
}
