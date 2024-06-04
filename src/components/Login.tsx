"use client";

import { FormEvent, useState } from "react";
import InputGroup from "./InputGroup";
import { useUserContext } from "@/context/user-context";
import { loginWithPass } from "@/lib/fncs";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUserContext();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithPass({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data?.user);
      login(data as unknown as User);
    },
  });

  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) return;

    mutate({ email, password });

    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-24 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold">Login</h2>
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
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
