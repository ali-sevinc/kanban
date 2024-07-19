"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  name: string;
  user_id: string;
  image: string;
  id: number;
} | null;

type InitialType = {
  user: User;
  handleLogin: (data: User) => void;
  handleLogout: () => void;
};

const initialState: InitialType = {
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
};

const UserContext = createContext(initialState);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const handleLogin = useCallback(function (userInfo: User) {
    setUser(userInfo);
  }, []);
  function handleLogout() {
    setUser(null);
  }
  useEffect(function () {}, []);

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
