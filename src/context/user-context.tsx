"use client";

import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: User | null | undefined;
  login: (data: User) => void;
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
  const [userData, setUserData] = useState<User | null | undefined>(null);

  const queryClient = useQueryClient();

  async function login(user: User | null) {
    setUserData(user);
    queryClient.setQueryData(["user"], user);
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
