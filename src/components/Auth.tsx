"use client";

import { FormEvent, useState } from "react";

import { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserContext } from "@/context/user-context";
import { auth } from "@/lib/fncs";

import InputGroup from "./InputGroup";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUserContext();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth({ mode, email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      login(data as unknown as User);
    },
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) return;

    mutate({ email, password });

    if (!error) {
      router.push("/");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-24 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold">
        {mode === "login" ? "Login" : "Create Account"}
      </h2>
      <InputGroup
        type="email"
        label="Email"
        id="email"
        onChange={(e) => setEmail(e)}
      />
      <InputGroup
        type="password"
        label="Password"
        id="password"
        onChange={(e) => setPassword(e)}
      />
      <div className="flex justify-between">
        <Button type="submit">{mode === "login" ? "Login" : "Singup"}</Button>
      </div>
      <button
        type="button"
        onClick={() =>
          setMode((prev) => (prev === "login" ? "signup" : "login"))
        }
      >
        {mode === "login"
          ? "Do you need an account? Go to Create Account page"
          : "Do you have an account? Go to Login page"}
      </button>
    </form>
  );
}
