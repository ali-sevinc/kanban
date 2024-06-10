"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { auth } from "@/lib/actions";

import InputGroup from "./InputGroup";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate, error } = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => auth({ mode, email, password, name }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      router.push("/");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) return;

    mutate({ email, password, name });
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
      {mode === "signup" && (
        <InputGroup label="Name" id="name" onChange={(e) => setName(e)} />
      )}
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
