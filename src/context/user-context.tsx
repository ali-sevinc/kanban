"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type UserType = { name: string; id: number };
type UserContextType = {
  user: UserType | null;
  login: (data: UserType) => void;
  logout: () => void;
};
const initialState: UserContextType = {
  user: null,
  login: () => {},
  logout: () => {},
};
const UserContext = createContext(initialState);

export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userData, setUserData] = useState<UserType | null>(null);

  async function login(user: UserType) {
    setUserData(user);
  }
  async function logout() {
    setUserData(null);
  }

  return (
    <UserContext.Provider value={{ user: userData, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext used outside of the scope...");
  return context;
}
