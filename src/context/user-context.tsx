"use client";

import { getUser } from "@/lib/fncs";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: User | null;
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
  const [userData, setUserData] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const login = useCallback(async function login(user: User | null) {
    setUserData(user);
  }, []);
  async function logout() {
    setUserData(null);
  }

  useEffect(
    function () {
      async function getInitialUser() {
        const user = await getUser();
        if (!user) {
          login(null);
          return;
        }
        login(user);
        queryClient.setQueryData(["user"], user);
      }
      getInitialUser();
    },
    [login, queryClient]
  );

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
